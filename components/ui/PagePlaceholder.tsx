export default function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="mt-1 text-slate-400">{description}</p>
      <div className="mt-6 rounded-xl border border-dashed border-slate-800 p-10 text-center text-sm text-slate-500">
        this page is under construction. Please check back later.
      </div>
    </main>
  );
}
