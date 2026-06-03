import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { MagneticButton } from "@/components/site/MagneticButton";
import { footerNav, SITE_TAGLINE, socialLinks } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="relative mt-auto border-t border-primary/20 bg-surface/50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="container mx-auto px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="footer" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {SITE_TAGLINE}
            </p>
            <div className="mt-8 rounded-2xl border border-border/60 bg-background/40 p-5">
              <p className="text-sm font-medium text-foreground">
                Have a vision worth building?
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us about your product, automation, or digital initiative.
              </p>
              <div className="mt-4">
                <MagneticButton href="/contact" size="sm">
                  Book a Strategy Call
                </MagneticButton>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-primary">
              Company
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {footerNav.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-primary">
              Services
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {footerNav.services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-primary">
              Connect
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="mailto:hello@aivrasol.com" className="hover:text-foreground">
                  hello@aivrasol.com
                </a>
              </li>
              <li>Global delivery · Remote-first studio</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border/50 pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} AIVRASOL. All rights reserved.</p>
          <p className="text-xs tracking-wide">
            Premium AI &amp; digital services
          </p>
        </div>
      </div>
    </footer>
  );
}
