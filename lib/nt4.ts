// Port tipado do nt4.js da WPILib (NetworkTables 4). Correções em relação ao original:
//  - addSample tinha duas sobrecargas e a segunda sobrescrevia a primeira
//  - "boolean" não existia na tabela de tipos (typeIdx undefined)
//  - announce checava params.pubid mas lia params.pubuid
//  - msgpack agora vem do pacote @msgpack/msgpack, sem global
import { encode, decodeMulti } from "@msgpack/msgpack";

const TYPE_IDX: Record<string, number> = {
  boolean: 0, double: 1, int: 2, float: 3, string: 4, json: 4, raw: 5, rpc: 5, msgpack: 5, protobuf: 5,
  "boolean[]": 16, "double[]": 17, "int[]": 18, "float[]": 19, "string[]": 20,
};

export interface Topic { name: string; type: string; id: number; pubuid: number; properties: Record<string, unknown>; }
export interface Handlers {
  onAnnounce(t: Topic): void;
  onUnannounce(t: Topic): void;
  onData(t: Topic, timestampUs: number, value: unknown): void;
  onConnect(): void;
  onDisconnect(): void;
}
interface Sub { topics: string[]; options: { periodic: number; all: boolean; topicsonly: boolean; prefix: boolean }; subuid: number; }

export class NT4Client {
  private ws: WebSocket | null = null;
  private open = false;
  private closed = false;
  private clientId = Math.floor(Math.random() * 99_999_999);
  private subs = new Map<number, Sub>();
  private announced = new Map<number, Topic>();
  private published = new Map<string, Topic>();
  private counter = 0;
  private offsetUs = 0;
  private timer = window.setInterval(() => this.sendTime(), 5000);

  constructor(private host: string, private h: Handlers) { this.connect(); }

  /** Pede todos os tópicos (prefixo "") com valores a cada `period` segundos. */
  subscribeAll(period = 0.05): void {
    const sub: Sub = { topics: [""], options: { periodic: period, all: false, topicsonly: false, prefix: true }, subuid: ++this.counter + this.clientId };
    this.subs.set(sub.subuid, sub);
    if (this.open) this.json("subscribe", sub);
  }

  /** Escreve um valor. Publica o tópico automaticamente na primeira escrita. */
  set(name: string, value: unknown): void {
    const known = [...this.announced.values()].find((t) => t.name === name);
    if (!known) throw new Error(`Tópico ${name} não anunciado pelo servidor`);
    let pub = this.published.get(name);
    if (!pub) {
      pub = { ...known, pubuid: ++this.counter + this.clientId };
      this.published.set(name, pub);
      this.json("publish", { name, type: pub.type, pubuid: pub.pubuid });
    }
    this.bin([pub.pubuid, this.serverTimeUs(), TYPE_IDX[pub.type], value]);
  }

  serverTimeUs(): number { return Math.round(performance.now() * 1000) + this.offsetUs; }

  close(): void { this.closed = true; clearInterval(this.timer); this.ws?.close(); }

  private connect(): void {
    if (this.closed) return;
    const url = `ws://${this.host}:5810/nt/FRCDash_${this.clientId}`;
    const ws = new WebSocket(url, "networktables.first.wpi.edu");
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
      this.open = true;
      this.announced.set(-1, { name: "Time", id: -1, pubuid: -1, type: "int", properties: {} });
      this.published.forEach((t) => this.json("publish", { name: t.name, type: t.type, pubuid: t.pubuid }));
      this.subs.forEach((s) => this.json("subscribe", s));
      this.h.onConnect();
    };
    ws.onclose = () => {
      this.open = false; this.ws = null; this.announced.clear();
      this.h.onDisconnect();
      if (!this.closed) setTimeout(() => this.connect(), 500);
    };
    ws.onerror = () => ws.close();
    ws.onmessage = (e) => (typeof e.data === "string" ? this.onText(e.data) : this.onBinary(e.data as ArrayBuffer));
    this.ws = ws;
  }

  private onText(raw: string): void {
    for (const msg of JSON.parse(raw) as { method: string; params: any }[]) {
      const p = msg.params;
      if (msg.method === "announce") {
        const t: Topic = { name: p.name, id: p.id, type: p.type, pubuid: p.pubid ?? this.published.get(p.name)?.pubuid ?? 0, properties: p.properties ?? {} };
        this.announced.set(t.id, t);
        this.h.onAnnounce(t);
      } else if (msg.method === "unannounce") {
        const t = this.announced.get(p.id);
        if (t) { this.announced.delete(t.id); this.h.onUnannounce(t); }
      }
    }
  }

  private onBinary(buf: ArrayBuffer): void {
    for (const frame of decodeMulti(new Uint8Array(buf)) as Iterable<[number, number, number, unknown]>) {
      const [id, ts, , value] = frame;
      if (id >= 0) { const t = this.announced.get(id); if (t) this.h.onData(t, ts, value); }
      else if (id === -1) { // resposta de sincronização (algoritmo de Cristian)
        const rx = Math.round(performance.now() * 1000), rtt = rx - (value as number);
        this.offsetUs = ts - rtt / 2 - rx;
      }
    }
  }

  private sendTime(): void { if (this.open) this.bin([-1, 0, TYPE_IDX.int, Math.round(performance.now() * 1000)]); }
  private json(method: string, params: unknown): void { if (this.open) this.ws!.send(JSON.stringify([{ method, params }])); }
  private bin(frame: unknown[]): void { if (this.open) this.ws!.send(encode(frame)); }
}
