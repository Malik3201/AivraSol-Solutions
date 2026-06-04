"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api/client";
import { adminFieldClass } from "@/lib/admin-styles";
import { login } from "@/lib/api/admin";
import { ApiClientError } from "@/lib/api/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupHint, setSetupHint] = useState<{
    seedEmail?: string;
    needsSeed?: boolean;
    hint?: string;
    jwtConfigured?: boolean;
    dbConfigured?: boolean;
  } | null>(null);

  useEffect(() => {
    void apiFetch<{
      seedEmail?: string;
      needsSeed?: boolean;
      hint?: string;
      jwtConfigured?: boolean;
      dbConfigured?: boolean;
    }>("/api/auth/setup-hint")
      .then((data) => {
        setSetupHint(data);
        if (data.seedEmail) {
          setEmail((prev) => prev || data.seedEmail!);
        }
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password;
    try {
      await login(normalizedEmail, normalizedPassword);
      toast.success("Welcome back");
      const target = from.startsWith("/admin") ? from : "/admin/dashboard";
      // Full navigation ensures the session cookie is sent to middleware/RSC
      window.location.assign(target);
      return;
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : "Login failed";
      if (err instanceof ApiClientError && err.status === 503) {
        toast.error(
          "Auth not configured. Set MONGODB_URI and ADMIN_JWT_SECRET (16+ chars) in .env, restart dev server.",
        );
      } else if (err instanceof ApiClientError && err.status === 401) {
        toast.error(
          `${msg} — Use ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD after running: npm run seed:admin`,
        );
      } else if (err instanceof Error) {
        toast.error(err.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050807] px-4">
      <div
        className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[rgba(8,14,12,0.92)] p-8 backdrop-blur-md"
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px -30px rgba(62,207,142,0.25)",
        }}
      >
        <p className="text-[11px] uppercase tracking-[0.34em] text-primary">
          AIVRASOL Admin
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage content, media, leads, and site settings.
        </p>
        {setupHint?.needsSeed ? (
          <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/90">
            No admin user in the database yet. In the project folder run:{" "}
            <code className="text-primary">npm run seed:admin</code>
            , then sign in with the email and password from{" "}
            <code className="text-primary">ADMIN_SEED_EMAIL</code> /{" "}
            <code className="text-primary">ADMIN_SEED_PASSWORD</code> in your .env
            file (not other random values).
          </p>
        ) : setupHint?.hint ? (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {setupHint.hint}
          </p>
        ) : setupHint?.seedEmail ? (
          <p className="mt-4 text-xs text-muted-foreground">
            Sign in with <span className="text-foreground">{setupHint.seedEmail}</span> and the
            exact <code className="text-primary">ADMIN_SEED_PASSWORD</code> from .env (no extra
            spaces). If it still fails, run{" "}
            <code className="text-primary">npm run seed:admin:reset</code>.
          </p>
        ) : null}
        {!setupHint?.jwtConfigured && setupHint !== null ? (
          <p className="mt-2 text-xs text-destructive">
            ADMIN_JWT_SECRET must be at least 16 characters, then restart{" "}
            <code>npm run dev</code>.
          </p>
        ) : null}
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-xs text-muted-foreground">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={adminFieldClass}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-xs text-muted-foreground">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={adminFieldClass}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <Link href="/" className="mt-6 block text-center text-sm text-primary hover:underline">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050807]" />}>
      <LoginForm />
    </Suspense>
  );
}
