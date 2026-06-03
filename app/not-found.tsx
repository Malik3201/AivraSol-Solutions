import Link from "next/link";
import { MagneticButton } from "@/components/site/MagneticButton";
import { PublicShell } from "@/components/site/PublicShell";

export default function NotFound() {
  return (
    <PublicShell>
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary">404</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
          This page isn&apos;t in our system yet.
        </h1>
        <p className="mt-5 max-w-lg text-muted-foreground">
          The route may have moved, or you followed an outdated link. Let&apos;s get
          you back to the AIVRASOL experience.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <MagneticButton href="/" size="lg">
            Back to Home
          </MagneticButton>
          <MagneticButton href="/contact" variant="outline" size="lg">
            Contact Us
          </MagneticButton>
        </div>
        <Link
          href="/services"
          className="mt-6 text-sm text-primary hover:underline"
        >
          Explore services
        </Link>
      </section>
    </PublicShell>
  );
}
