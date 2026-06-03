export const SITE_NAME = "AIVRASOL";
export const SITE_TAGLINE =
  "Premium AI and digital services for ambitious brands building the future.";

export const AIVA_ROBOT_IMAGE =
  "https://ik.imagekit.io/aivrasol/flotting-robo-.png";

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/team", label: "Team" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerNav = {
  company: [
    { href: "/about", label: "About" },
    { href: "/team", label: "Team" },
    { href: "/blog", label: "Insights" },
    { href: "/contact", label: "Contact" },
  ],
  services: [
    { href: "/services", label: "All Services" },
    { href: "/projects", label: "Case Studies" },
  ],
} as const;

export const socialLinks = [
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://github.com", label: "GitHub" },
  { href: "https://twitter.com", label: "X" },
] as const;
