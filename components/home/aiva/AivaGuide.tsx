"use client";

import Image from "next/image";
import { AivaSpeechBubble } from "@/components/home/aiva/AivaSpeechBubble";
import { AIVA_ROBOT_IMAGE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function AivaGuide({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-[rgba(10,16,14,0.88)] p-3.5 backdrop-blur-md md:hidden",
        className,
      )}
    >
      <Image
        src={AIVA_ROBOT_IMAGE}
        alt="Aiva"
        width={56}
        height={56}
        className="shrink-0 drop-shadow-[0_8px_20px_rgba(62,207,142,0.25)]"
      />
      <div className="relative min-w-0 flex-1 pt-0.5">
        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-primary">
          Aiva
        </p>
        <p className="text-xs leading-relaxed text-foreground/90">{message}</p>
      </div>
    </div>
  );
}
