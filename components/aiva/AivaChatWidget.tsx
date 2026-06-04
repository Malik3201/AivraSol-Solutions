"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AivaChatWindow } from "@/components/aiva/AivaChatWindow";
import { AivaLauncher } from "@/components/aiva/AivaLauncher";
import { aivaChat } from "@/lib/api/public";
import { ApiClientError } from "@/lib/api/client";
import type { AivaChatMessage } from "@/lib/api/types";
import { AIVA_DEFAULT_SUGGESTIONS } from "@/lib/contact-constants";
import { getAivaSessionId, resetAivaSessionId } from "@/lib/aiva-session";

const GREETING =
  "Hi, I'm Aiva. I can help you explore AIVRASOL services, projects, and the best path for your idea.";

function createMessage(role: AivaChatMessage["role"], content: string): AivaChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    timestamp: Date.now(),
  };
}

function pageContextFromPath(pathname: string): string {
  if (pathname === "/") return "homepage";
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/contact")) return "contact";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/team")) return "team";
  return "general";
}

export function AivaChatWidget() {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<AivaChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([...AIVA_DEFAULT_SUGGESTIONS]);
  const [leadIntent, setLeadIntent] = useState<"low" | "medium" | "high">("low");
  const [recommendedSlug, setRecommendedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    setSessionId(getAivaSessionId());
    setMessages([createMessage("assistant", GREETING)]);
  }, []);

  const pageContext = useMemo(() => pageContextFromPath(pathname), [pathname]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setMessages((prev) => [...prev, createMessage("user", trimmed)]);
      setInput("");
      setLoading(true);

      try {
        const res = await aivaChat({
          message: trimmed,
          sessionId: sessionId || getAivaSessionId(),
          pageContext,
          currentPage: pathname,
        });

        setMessages((prev) => [...prev, createMessage("assistant", res.reply)]);
        if (res.suggestedActions?.length) {
          setSuggestions(res.suggestedActions);
        }
        setLeadIntent(res.leadIntent);
        setRecommendedSlug(res.recommendedServiceSlug);
      } catch (err) {
        const fallback =
          err instanceof ApiClientError && err.status === 404
            ? "Chat service is unavailable. Restart the dev server (delete the .next folder if needed) and try again."
            : "I'm having trouble connecting right now. You can explore our services or start a project via the contact page.";
        setMessages((prev) => [...prev, createMessage("assistant", fallback)]);
        if (err instanceof ApiClientError) {
          if (err.status === 429) {
            toast.error("Too many messages — please wait a moment.");
          } else if (err.status !== 404) {
            toast.error(err.message);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId, pageContext, pathname],
  );

  const handleReset = () => {
    const newId = resetAivaSessionId();
    setSessionId(newId);
    setMessages([createMessage("assistant", GREETING)]);
    setSuggestions([...AIVA_DEFAULT_SUGGESTIONS]);
    setLeadIntent("low");
    setRecommendedSlug(null);
    setInput("");
  };

  return (
    <>
      <AivaLauncher
        onClick={() => setOpen((v) => !v)}
        isOpen={open}
        subtle={isHome}
      />
      <AivaChatWindow
        open={open}
        onClose={() => setOpen(false)}
        messages={messages}
        suggestions={suggestions}
        recommendedServiceSlug={recommendedSlug}
        leadIntent={leadIntent}
        loading={loading}
        input={input}
        onInputChange={setInput}
        onSend={() => sendMessage(input)}
        onReset={handleReset}
        onSuggestionSelect={(text) => {
          setOpen(true);
          void sendMessage(text);
        }}
      />
    </>
  );
}
