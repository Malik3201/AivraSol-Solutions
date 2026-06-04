import type { PublicTestimonial } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function TeamProfileTestimonials({
  testimonials,
  memberName,
  className,
}: {
  testimonials: PublicTestimonial[];
  memberName: string;
  className?: string;
}) {
  const list = testimonials.slice(0, 2);
  if (!list.length) return null;

  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      {list.map((t) => (
        <blockquote
          key={t.id}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm"
        >
          <p className="text-sm leading-relaxed text-white/80">&ldquo;{t.quote}&rdquo;</p>
          <footer className="mt-4 border-t border-white/[0.06] pt-4 text-xs text-muted-foreground">
            <span className="font-medium text-white">{t.clientName}</span>
            {[t.clientRole, t.company].filter(Boolean).join(" · ")}
          </footer>
        </blockquote>
      ))}
      <p className="col-span-full text-center text-xs text-muted-foreground md:text-left">
        Client voices from the AIVRASOL studio — work delivered with {memberName.split(" ")[0]}&apos;s discipline.
      </p>
    </div>
  );
}
