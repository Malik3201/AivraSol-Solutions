"use client";

import dynamic from "next/dynamic";

const AivaScrollJourney = dynamic(
  () => import("@/components/home/AivaScrollJourney"),
  { ssr: false },
);

export function HomeAivaClient() {
  return <AivaScrollJourney />;
}
