"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { AIVA_ROBOT_IMAGE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function AivaLauncher({
  onClick,
  isOpen,
  subtle,
}: {
  onClick: () => void;
  isOpen: boolean;
  subtle?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls="aiva-chat-window"
      aria-label={isOpen ? "Close Aiva chat" : "Open Aiva assistant chat"}
      className={cn(
        "group fixed z-[90] flex items-center justify-center rounded-full border border-primary/30 bg-[rgba(8,14,12,0.92)] shadow-[0_12px_40px_-12px_rgba(62,207,142,0.45)] backdrop-blur-md transition-transform hover:scale-[1.03] active:scale-[0.98]",
        subtle ? "bottom-20 right-4 size-12 md:bottom-24 md:right-6" : "bottom-5 right-4 size-14 md:bottom-6 md:right-6",
      )}
    >
      <span className="absolute inset-0 rounded-full bg-primary/15 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
      {subtle ? (
        <Image
          src={AIVA_ROBOT_IMAGE}
          alt=""
          width={32}
          height={32}
          className="relative object-contain"
        />
      ) : (
        <span className="relative flex size-full items-center justify-center">
          <Image
            src={AIVA_ROBOT_IMAGE}
            alt=""
            width={40}
            height={40}
            className="object-contain p-1.5"
          />
          <MessageCircle className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-primary text-primary-foreground p-0.5" />
        </span>
      )}
    </button>
  );
}
