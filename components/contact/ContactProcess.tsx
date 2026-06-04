import { PremiumCard } from "@/components/site/PremiumCard";

const STEPS = [
  {
    step: "01",
    title: "We understand your goals",
    detail: "We review your message, context, and constraints to clarify what success looks like.",
  },
  {
    step: "02",
    title: "We map the right system",
    detail: "Strategy, UX, engineering, and AI layers are shaped into a coherent product direction.",
  },
  {
    step: "03",
    title: "We propose the build path",
    detail: "You receive a clear recommendation — scope, phases, timeline, and practical next steps.",
  },
];

export function ContactProcess() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {STEPS.map((s) => (
        <PremiumCard key={s.step}>
          <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-primary">
            {s.step}
          </span>
          <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
        </PremiumCard>
      ))}
    </div>
  );
}
