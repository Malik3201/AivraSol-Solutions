import { PremiumCard } from "@/components/site/PremiumCard";

export function ProjectResults({ results }: { results?: string[] }) {
  const list =
    results?.length
      ? results
      : [
          "Clearer workflows for teams and customers",
          "Improved conversion paths and product clarity",
          "Automation reducing manual operational load",
          "Platform ready for ongoing iteration",
        ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {list.map((item) => (
        <PremiumCard key={item}>
          <p className="text-sm leading-relaxed text-foreground/90">{item}</p>
        </PremiumCard>
      ))}
    </div>
  );
}
