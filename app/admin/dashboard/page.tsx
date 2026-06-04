"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Briefcase,
  FileText,
  Mail,
  Users,
  Wrench,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeleton";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getDashboard } from "@/lib/api/admin";
import type { AdminDashboardStats } from "@/lib/api/types";
import { adminPanelClass } from "@/lib/admin-styles";
import { buttonVariants } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getDashboard()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.34em] text-primary">Command center</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Overview of content, leads, and recent activity across AIVRASOL.
        </p>
      </div>

      {loading ? (
        <AdminTableSkeleton rows={6} />
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Services" value={stats.totalServices} hint={`${stats.activeServices} active`} icon={Wrench} accent />
            <StatCard label="Projects" value={stats.totalProjects} hint={`${stats.activeProjects} active`} icon={Briefcase} />
            <StatCard label="Team" value={stats.totalTeamMembers} icon={Users} />
            <StatCard label="Blog posts" value={stats.totalBlogPosts} hint={`${stats.publishedBlogPosts} published`} icon={FileText} />
            <StatCard label="Leads" value={stats.totalContactLeads} hint={`${stats.newContactLeads} new`} icon={Mail} accent />
            <StatCard label="Testimonials" value={stats.totalTestimonials} />
            <StatCard label="FAQs" value={stats.totalFAQs} />
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { href: "/admin/services", label: "Manage services" },
              { href: "/admin/projects", label: "Manage projects" },
              { href: "/admin/leads", label: "View leads" },
              { href: "/admin/blog", label: "Edit blog" },
            ].map((a) => (
              <Link key={a.href} href={a.href} className={buttonVariants({ variant: "outline", size: "sm" })}>
                {a.label}
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <section className={adminPanelClass + " p-5"}>
              <h2 className="text-sm font-semibold text-white">Recent leads</h2>
              <ul className="mt-4 space-y-3">
                {stats.recentContactLeads.length ? (
                  stats.recentContactLeads.map((lead) => (
                    <li key={lead.id} className="flex items-start justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium text-white">{lead.name}</p>
                        <p className="text-muted-foreground">{lead.email}</p>
                      </div>
                      <StatusBadge label={lead.status} variant={lead.status} />
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No leads yet.</p>
                )}
              </ul>
            </section>
            <section className={adminPanelClass + " p-5"}>
              <h2 className="text-sm font-semibold text-white">Recently updated</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {stats.recentUpdatedContent.services.map((s) => (
                  <li key={s.id}>Service: {s.title}</li>
                ))}
                {stats.recentUpdatedContent.projects.map((p) => (
                  <li key={p.id}>Project: {p.title}</li>
                ))}
                {stats.recentUpdatedContent.blogPosts.map((b) => (
                  <li key={b.id}>
                    Blog: {b.title} ({b.status})
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      ) : null}
    </AdminShell>
  );
}
