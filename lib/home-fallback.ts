import type {
  HomePageData,
  PublicFAQ,
  PublicProject,
  PublicService,
  PublicTeamMember,
  PublicTestimonial,
} from "@/lib/api/types";

export const FALLBACK_SERVICES: PublicService[] = [
  {
    id: "1",
    title: "AI Strategy & Advisory",
    slug: "ai-strategy-advisory",
    shortDescription:
      "Clarify roadmap, architecture, and ROI before you invest in the wrong stack or features.",
  },
  {
    id: "2",
    title: "Premium Web Platforms",
    slug: "premium-web-platforms",
    shortDescription:
      "Custom Next.js platforms engineered for performance, SEO, and long-term scalability.",
  },
  {
    id: "3",
    title: "Automation Systems",
    slug: "business-automation",
    shortDescription:
      "Connect tools, data, and teams with automation systems that reduce manual work and errors.",
  },
  {
    id: "4",
    title: "AI Assistants & Chatbots",
    slug: "ai-product-engineering",
    shortDescription:
      "Design and deploy intelligent assistants with production-ready workflows and integrations.",
  },
];

export const FALLBACK_PROJECTS: PublicProject[] = [
  {
    id: "1",
    title: "Intelligent Client Portal",
    slug: "intelligent-client-portal",
    industry: "Professional Services",
    shortDescription:
      "A secure portal with AI-assisted workflows, role-based access, and measurable efficiency gains.",
    clientName: "Confidential",
  },
  {
    id: "2",
    title: "Growth Commerce Stack",
    slug: "growth-commerce-stack",
    industry: "Retail",
    shortDescription:
      "Headless commerce architecture with automation, analytics, and conversion-focused UX.",
  },
  {
    id: "3",
    title: "Operations Automation Hub",
    slug: "operations-automation-hub",
    industry: "Logistics",
    shortDescription:
      "Unified dashboards and AI-assisted routing for faster decisions across distributed teams.",
  },
];

export const FALLBACK_TEAM: PublicTeamMember[] = [
  {
    id: "1",
    name: "Alex Mercer",
    slug: "alex-mercer",
    role: "Founder & Product Strategist",
    bio: "Leads vision, delivery standards, and client outcomes across AI and platform initiatives.",
  },
  {
    id: "2",
    name: "Sofia Rahman",
    slug: "sofia-rahman",
    role: "Lead AI Engineer",
    bio: "Architects intelligent systems, integrations, and reliable model-driven workflows.",
  },
  {
    id: "3",
    name: "Daniel Okoye",
    slug: "daniel-okoye",
    role: "Design Director",
    bio: "Shapes premium interfaces, motion systems, and brand-forward digital experiences.",
  },
];

export const FALLBACK_TESTIMONIALS: PublicTestimonial[] = [
  {
    id: "1",
    clientName: "Elena Varga",
    clientRole: "COO",
    company: "Northline Group",
    quote:
      "AIVRASOL translated a complex automation vision into a polished platform our teams actually use every day.",
    rating: 5,
  },
  {
    id: "2",
    clientName: "Marcus Chen",
    clientRole: "Head of Product",
    company: "Atlas Digital",
    quote:
      "The combination of strategy, design, and engineering felt like working with a senior in-house studio — not a vendor.",
    rating: 5,
  },
];

export const FALLBACK_FAQS: PublicFAQ[] = [
  {
    id: "1",
    question: "What types of projects does AIVRASOL take on?",
    answer:
      "We partner on AI products, automation systems, premium websites, and full digital platforms for ambitious brands.",
    category: "general",
  },
  {
    id: "2",
    question: "How long does a typical engagement take?",
    answer:
      "Timelines depend on scope. Discovery-led projects often begin with a 2–4 week strategy phase, followed by phased delivery.",
    category: "process",
  },
  {
    id: "3",
    question: "Can you work with our existing team and stack?",
    answer:
      "Yes. We integrate with your team, tools, and infrastructure — or recommend a modern stack when it improves outcomes.",
    category: "collaboration",
  },
];

export const FALLBACK_HOME_DATA: HomePageData = {
  hero: null,
  featuredServices: FALLBACK_SERVICES,
  featuredProjects: FALLBACK_PROJECTS,
  featuredTestimonials: FALLBACK_TESTIMONIALS,
  teamPreview: FALLBACK_TEAM,
  faqPreview: FALLBACK_FAQS,
  robotGuideSettings: null,
  seo: {
    title: "AIVRASOL | Premium AI & Digital Services",
    description:
      "AIVRASOL designs and builds intelligent websites, automation systems, AI assistants, and scalable digital products.",
    keywords: ["AIVRASOL", "AI services", "automation"],
    canonical: "/",
    openGraph: {
      title: "AIVRASOL",
      description: "Premium AI & digital services",
      url: "/",
    },
  },
  stats: {
    projects: "40+",
    industries: "12",
    automation: "85%",
  },
  settings: {},
};
