import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildPageMetadata } from "@/lib/services/seo";

export const metadata = buildPageMetadata({
  title: "Admin Login",
  description: "Secure admin access for AIVRASOL content management.",
  path: "/admin/login",
});

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader>
          <CardTitle className="tracking-[0.2em] text-primary">
            AIVRASOL ADMIN
          </CardTitle>
          <CardDescription>
            {/* TODO: Wire React Hook Form to POST /api/auth/login */}
            Sign in to manage website content, media, leads, and settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Login form UI will be implemented in the next admin auth phase.</p>
          <Link href="/" className="text-primary hover:underline">
            Back to website
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
