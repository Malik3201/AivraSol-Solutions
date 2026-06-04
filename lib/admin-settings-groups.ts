export type SettingFieldType = "text" | "textarea" | "image" | "json" | "number";

export type SettingFieldDef = {
  key: string;
  label: string;
  type: SettingFieldType;
  description?: string;
  isPublic?: boolean;
};

export type SettingGroupDef = {
  id: string;
  label: string;
  fields: SettingFieldDef[];
};

export const ADMIN_SETTING_GROUPS: SettingGroupDef[] = [
  {
    id: "brand",
    label: "Brand",
    fields: [
      { key: "companyName", label: "Company name", type: "text", isPublic: true },
      { key: "tagline", label: "Tagline", type: "text", isPublic: true },
      { key: "logo", label: "Logo URL", type: "image", isPublic: true },
      { key: "footerLogo", label: "Footer logo URL", type: "image", isPublic: true },
      { key: "favicon", label: "Favicon URL", type: "image", isPublic: true },
      { key: "themeColors", label: "Theme colors (JSON)", type: "json", isPublic: true },
    ],
  },
  {
    id: "home",
    label: "Home",
    fields: [
      { key: "heroTitle", label: "Hero title", type: "text", isPublic: true },
      { key: "heroSubtitle", label: "Hero subtitle", type: "textarea", isPublic: true },
      { key: "homeStats", label: "Stats (JSON array)", type: "json", isPublic: true },
      { key: "robotGuideSettings", label: "Robot guide settings (JSON)", type: "json", isPublic: true },
      { key: "ctaPrimaryLabel", label: "Primary CTA label", type: "text", isPublic: true },
      { key: "ctaSecondaryLabel", label: "Secondary CTA label", type: "text", isPublic: true },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    fields: [
      { key: "globalSeo", label: "Global SEO (JSON)", type: "json", isPublic: true },
      { key: "seo.home", label: "Home SEO (JSON)", type: "json", isPublic: true },
      { key: "seo.about", label: "About SEO (JSON)", type: "json", isPublic: true },
      { key: "seo.services", label: "Services SEO (JSON)", type: "json", isPublic: true },
      { key: "seo.projects", label: "Projects SEO (JSON)", type: "json", isPublic: true },
      { key: "seo.team", label: "Team SEO (JSON)", type: "json", isPublic: true },
      { key: "seo.contact", label: "Contact SEO (JSON)", type: "json", isPublic: true },
      { key: "seo.blog", label: "Blog SEO (JSON)", type: "json", isPublic: true },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    fields: [
      { key: "contactEmail", label: "Public email", type: "text", isPublic: true },
      { key: "phone", label: "Phone", type: "text", isPublic: true },
      { key: "address", label: "Address", type: "text", isPublic: true },
      { key: "leadReceiverEmail", label: "Lead receiver email", type: "text" },
    ],
  },
  {
    id: "social",
    label: "Social",
    fields: [
      { key: "socialLinks", label: "Social links (JSON)", type: "json", isPublic: true },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    fields: [
      { key: "mainNav", label: "Main nav (JSON)", type: "json", isPublic: true },
      { key: "footerNav", label: "Footer nav (JSON)", type: "json", isPublic: true },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    fields: [
      { key: "footerStatement", label: "Footer statement", type: "textarea", isPublic: true },
      { key: "copyright", label: "Copyright", type: "text", isPublic: true },
      { key: "footerServiceLinks", label: "Footer service links (JSON)", type: "json", isPublic: true },
    ],
  },
];
