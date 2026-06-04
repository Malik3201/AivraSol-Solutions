import { PublicLayoutClient } from "@/components/site/PublicLayoutClient";
import { PublicShell } from "@/components/site/PublicShell";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicShell>
      <PublicLayoutClient>{children}</PublicLayoutClient>
    </PublicShell>
  );
}
