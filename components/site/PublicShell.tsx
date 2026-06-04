import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AnimatedBackground variant="subtle" className="fixed inset-0 -z-10 opacity-50" />
      <SiteHeader />
      <main className="relative z-10 flex-1 overflow-x-clip">{children}</main>
      <SiteFooter />
    </div>
  );
}
