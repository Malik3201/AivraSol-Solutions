import { AIWorkflowSection } from "@/components/home/AIWorkflowSection";
import { HomeAivaClient } from "@/components/home/HomeAivaClient";
import { FAQPreview } from "@/components/home/FAQPreview";
import { FinalCTA } from "@/components/home/FinalCTA";
import { HomeHero } from "@/components/home/HomeHero";
import { IntroSection } from "@/components/home/IntroSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ProjectsShowcase } from "@/components/home/ProjectsShowcase";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { TeamPreview } from "@/components/home/TeamPreview";
import { TechStackSection } from "@/components/home/TechStackSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { getHomePageContent } from "@/lib/home-data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Intelligent Digital Systems for Ambitious Brands",
  description:
    "AIVRASOL designs premium websites, AI assistants, automation workflows, and scalable digital platforms for modern businesses.",
  path: "/",
});

export default async function HomePage() {
  const content = await getHomePageContent();

  return (
    <>
      <HomeHero />
      <TrustStrip />
      <HomeAivaClient />

      <div id="aiva-journey" className="relative overflow-x-clip">
        <IntroSection />
        <ServicesShowcase services={content.featuredServices} />
        <ProcessSection />
        <ProjectsShowcase projects={content.featuredProjects} />
        <AIWorkflowSection />
        <TeamPreview members={content.teamPreview} />
        <TestimonialsSection testimonials={content.featuredTestimonials} />
        <TechStackSection />
        <FAQPreview faqs={content.faqPreview} />
        <FinalCTA />
      </div>
    </>
  );
}
