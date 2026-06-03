import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/site-config";

type LogoVariant = "default" | "compact" | "footer";

export function Logo({
  variant = "default",
  className,
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  const compact = variant === "compact";
  const footer = variant === "footer";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 transition-opacity hover:opacity-90",
        className,
      )}
      aria-label={`${SITE_NAME} home`}
    >
      <span
        className={cn(
          "relative flex items-center justify-center rounded-xl border border-primary/25 bg-primary/10",
          compact ? "size-9" : "size-10",
        )}
      >
        <Image
          src="/brand/logo.svg"
          alt=""
          width={compact ? 22 : 26}
          height={compact ? 22 : 26}
          className="relative z-10"
          priority
        />
        <span className="absolute inset-0 rounded-xl bg-primary/20 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-semibold tracking-[0.22em] text-foreground",
              footer ? "text-sm" : "text-base",
            )}
          >
            {SITE_NAME}
          </span>
          {!footer && (
            <span className="mt-1 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              AI Studio
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
