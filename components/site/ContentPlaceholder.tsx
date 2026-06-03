import { PremiumCard } from "@/components/site/PremiumCard";
import { SectionShell } from "@/components/site/SectionShell";
import { SectionHeading } from "@/components/site/SectionHeading";

export function ContentPlaceholder({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items?: string[];
}) {
  return (
    <SectionShell>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(items ?? ["Module A", "Module B", "Module C"]).map((item) => (
          <PremiumCard key={item}>
            <p className="text-xs uppercase tracking-[0.25em] text-primary">Coming next</p>
            <h3 className="mt-3 text-lg font-medium">{item}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Dynamic content from the CMS will render here in the next frontend phase.
            </p>
          </PremiumCard>
        ))}
      </div>
    </SectionShell>
  );
}
