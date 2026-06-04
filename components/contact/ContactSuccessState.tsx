import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContactSuccessState({ onReset }: { onReset?: () => void }) {
  return (
    <div
      className="rounded-2xl border border-primary/25 bg-primary/5 px-6 py-10 text-center"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="mx-auto size-10 text-primary" aria-hidden />
      <h3 className="mt-4 text-xl font-semibold text-white">Message received</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Thank you for reaching out. We will review your inquiry and respond within one
        business day with next steps.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/services" className={cn(buttonVariants({ variant: "outline" }))}>
          Explore services
        </Link>
        {onReset ? (
          <button type="button" onClick={onReset} className={cn(buttonVariants())}>
            Send another message
          </button>
        ) : null}
      </div>
    </div>
  );
}
