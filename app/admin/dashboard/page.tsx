import { AdminShell } from "@/components/admin/admin-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          "Services",
          "Projects",
          "Team",
          "Blog Posts",
          "Leads",
          "Media Assets",
        ].map((item) => (
          <Card key={item} className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">{item}</CardTitle>
              <CardDescription>
                {/* TODO: Replace with live counts from MongoDB */}
                CMS module placeholder
              </CardDescription>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-primary">
              —
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
