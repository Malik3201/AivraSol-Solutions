import {
  Bot,
  Database,
  FileText,
  Mail,
  Search,
  Workflow,
} from "lucide-react";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { HomeSection } from "@/components/home/HomeSection";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";

const NODES = [
  { icon: Bot, label: "Aiva Chatbot", left: "50%", top: "12%" },
  { icon: FileText, label: "Admin AI Content", left: "82%", top: "32%" },
  { icon: Mail, label: "Contact Assist", left: "88%", top: "58%" },
  { icon: Workflow, label: "Workflow Automation", left: "68%", top: "78%" },
  { icon: Search, label: "SEO Intelligence", left: "32%", top: "78%" },
  { icon: Database, label: "Business Data", left: "12%", top: "58%" },
];

export function AIWorkflowSection() {
  return (
    <AivaWaypoint id="ai-workflow">
      <HomeSection
        id="ai-workflow"
        background="system"
        tall
        eyebrow="AI Systems"
        title="Intelligence woven through the product — not bolted on."
        description="Assistants, admin tools, and automation share one context layer."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES["ai-workflow"]} className="mb-8" />

        <div className="relative mx-auto min-h-[560px] w-full max-w-[980px] overflow-hidden rounded-3xl border border-white/[0.06] bg-[rgba(8,12,10,0.5)]">
          <svg
            className="pointer-events-none absolute inset-0 size-full text-primary/20"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <circle cx="50" cy="48" r="32" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="3 4" />
            <line x1="50" y1="48" x2="50" y2="12" stroke="currentColor" strokeWidth="0.15" />
            <line x1="50" y1="48" x2="82" y2="32" stroke="currentColor" strokeWidth="0.15" />
            <line x1="50" y1="48" x2="88" y2="58" stroke="currentColor" strokeWidth="0.15" />
            <line x1="50" y1="48" x2="68" y2="78" stroke="currentColor" strokeWidth="0.15" />
            <line x1="50" y1="48" x2="32" y2="78" stroke="currentColor" strokeWidth="0.15" />
            <line x1="50" y1="48" x2="12" y2="58" stroke="currentColor" strokeWidth="0.15" />
          </svg>

          <AivaDock id="ai-workflow" className="left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2" />

          <div className="absolute left-1/2 top-[48%] flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-[9px] font-semibold uppercase tracking-wider text-primary md:size-20">
            Core
          </div>

          {NODES.map((node) => (
            <div
              key={node.label}
              className="absolute max-w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/[0.08] bg-[rgba(10,16,14,0.92)] px-2.5 py-2 text-center backdrop-blur-md"
              style={{ left: node.left, top: node.top }}
            >
              <node.icon className="mx-auto mb-1 size-3.5 text-primary" aria-hidden />
              <p className="text-[9px] font-medium leading-tight">{node.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-3 md:hidden">
          {NODES.map((n) => (
            <div key={n.label} className="flex items-center gap-3 rounded-xl border border-white/[0.08] px-4 py-3">
              <n.icon className="size-4 text-primary" />
              <span className="text-sm">{n.label}</span>
            </div>
          ))}
        </div>
      </HomeSection>
    </AivaWaypoint>
  );
}
