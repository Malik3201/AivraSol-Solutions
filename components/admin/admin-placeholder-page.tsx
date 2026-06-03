import { AdminShell } from "@/components/admin/admin-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AdminPlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AdminShell title={title}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{title} Module</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {/* TODO: CRUD tables, forms, ImageKit uploads, and TanStack Query data hooks */}
          Admin CRUD UI for this module will be implemented in the next phase.
        </CardContent>
      </Card>
    </AdminShell>
  );
}
