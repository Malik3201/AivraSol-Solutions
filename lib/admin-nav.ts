import {
  Briefcase,
  FileText,
  HelpCircle,
  ImageIcon,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/leads", label: "Leads", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
