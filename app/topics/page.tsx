import PagePlaceholder from "@/components/ui/PagePlaceholder";
import { navLinks } from "@/lib/config/site-config";

const link = navLinks.find((l) => l.href === "/topics")!;

export default function Page() {
  return <PagePlaceholder title={link.label} description={link.description} />;
}
