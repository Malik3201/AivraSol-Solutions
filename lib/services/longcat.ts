import { connectDB } from "@/lib/db";
import { isLongCatConfigured } from "@/lib/env";
import { AiLog, type AiFeature } from "@/lib/models/AiLog";
import { ApiError } from "@/lib/api-error";
import { Service, Project, FAQ } from "@/lib/models";
import { getPublicSettingsMap } from "@/lib/services/public-content";

const BRAND_VOICE = `You are writing for AIVRASOL, a premium AI and digital services studio.
Voice: confident, modern, strategic, human. Avoid generic AI buzzwords, hype, and fake claims.
Do not invent client results, metrics, or case studies unless the user explicitly provided them.`;

const REQUEST_TIMEOUT_MS = 45_000;

export interface LongCatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionInput {
  messages: LongCatMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "json_object" | "text";
}

export interface ChatCompletionResult {
  content: string;
  model: string;
  tokensUsed?: number;
  raw?: unknown;
}

export class LongCatUnavailableError extends Error {
  constructor(message = "AI service is temporarily unavailable") {
    super(message);
    this.name = "LongCatUnavailableError";
  }
}

export async function chatCompletion(
  input: ChatCompletionInput,
): Promise<ChatCompletionResult> {
  if (!isLongCatConfigured()) {
    throw new LongCatUnavailableError();
  }

  const baseUrl = process.env.LONGCAT_BASE_URL!.replace(/\/$/, "");
  const model = process.env.LONGCAT_MODEL ?? "default";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const body: Record<string, unknown> = {
      model,
      messages: input.messages,
      temperature: input.temperature ?? 0.7,
      max_tokens: input.maxTokens ?? 2048,
    };

    if (input.responseFormat === "json_object") {
      body.response_format = { type: "json_object" };
    }

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LONGCAT_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new LongCatUnavailableError("AI provider returned an error");
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { total_tokens?: number };
    };

    const content = data.choices?.[0]?.message?.content ?? "";

    return {
      content,
      model,
      tokensUsed: data.usage?.total_tokens,
      raw: process.env.NODE_ENV === "development" ? data : undefined,
    };
  } catch (error) {
    if (error instanceof LongCatUnavailableError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new LongCatUnavailableError("AI request timed out");
    }
    throw new LongCatUnavailableError();
  } finally {
    clearTimeout(timeout);
  }
}

export async function logAiCall(params: {
  feature: AiFeature;
  prompt: string;
  response?: string;
  model?: string;
  tokensUsed?: number;
  status: "success" | "failed";
  errorMessage?: string;
  createdBy?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await connectDB();
    await AiLog.create({
      feature: params.feature,
      prompt: params.prompt.slice(0, 8000),
      response: params.response?.slice(0, 16000),
      model: params.model,
      tokensUsed: params.tokensUsed,
      status: params.status,
      errorMessage: params.errorMessage,
      createdBy: params.createdBy,
      metadata: params.metadata,
    });
  } catch {
    console.error("[ai] failed to save AiLog");
  }
}

function parseJsonContent<T>(content: string, fallback: T): T {
  try {
    const cleaned = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

async function runStructuredGeneration<T>(params: {
  feature: AiFeature;
  system: string;
  user: string;
  adminId?: string;
  metadata?: Record<string, unknown>;
  fallback: T;
}): Promise<T> {
  const prompt = `${params.system}\n\n${params.user}`;

  try {
    const result = await chatCompletion({
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.user },
      ],
      temperature: 0.6,
      maxTokens: 3000,
      responseFormat: "json_object",
    });

    const parsed = parseJsonContent<T>(result.content, params.fallback);

    await logAiCall({
      feature: params.feature,
      prompt,
      response: result.content,
      model: result.model,
      tokensUsed: result.tokensUsed,
      status: "success",
      createdBy: params.adminId,
      metadata: params.metadata,
    });

    return parsed;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AI generation failed";

    await logAiCall({
      feature: params.feature,
      prompt,
      status: "failed",
      errorMessage: message,
      createdBy: params.adminId,
      metadata: params.metadata,
    });

    if (error instanceof LongCatUnavailableError) {
      return params.fallback;
    }

    throw error;
  }
}

export async function generateServiceContent(
  input: {
    title: string;
    targetAudience?: string;
    tone?: string;
    keywords?: string[];
    shortNotes?: string;
  },
  adminId?: string,
) {
  const fallback = {
    title: input.title,
    shortDescription: input.shortNotes?.slice(0, 200) ?? "",
    description: "",
    features: [] as string[],
    processSteps: [] as Array<{ title: string; description: string }>,
    seoTitle: `${input.title} | AIVRASOL`,
    seoDescription: "",
    seoKeywords: input.keywords ?? [],
    _aiFallback: true,
  };

  return runStructuredGeneration({
    feature: "admin_content_generate",
    adminId,
    metadata: { type: "service" },
    fallback,
    system: `${BRAND_VOICE} Return valid JSON only.`,
    user: `Generate service page draft content as JSON:
{
  "title": string,
  "shortDescription": string,
  "description": string (markdown-friendly),
  "features": string[],
  "processSteps": [{"title": string, "description": string}],
  "seoTitle": string,
  "seoDescription": string,
  "seoKeywords": string[]
}
Title: ${input.title}
Audience: ${input.targetAudience ?? "business leaders"}
Tone: ${input.tone ?? "premium professional"}
Keywords: ${(input.keywords ?? []).join(", ")}
Notes: ${input.shortNotes ?? ""}`,
  });
}

export async function generateProjectContent(
  input: {
    title: string;
    clientIndustry?: string;
    serviceType?: string;
    problemNotes?: string;
    solutionNotes?: string;
    resultNotes?: string;
  },
  adminId?: string,
) {
  const fallback = {
    title: input.title,
    shortDescription: "",
    description: "",
    problem: input.problemNotes ?? "",
    solution: input.solutionNotes ?? "",
    results: input.resultNotes ? [input.resultNotes] : [],
    technologies: [] as string[],
    seoTitle: `${input.title} | AIVRASOL`,
    seoDescription: "",
    seoKeywords: [] as string[],
    _aiFallback: true,
  };

  return runStructuredGeneration({
    feature: "admin_content_generate",
    adminId,
    metadata: { type: "project" },
    fallback,
    system: `${BRAND_VOICE} Only use result metrics explicitly provided. Return valid JSON only.`,
    user: `Generate case study draft as JSON:
{
  "title", "shortDescription", "description", "problem", "solution",
  "results": string[], "technologies": string[],
  "seoTitle", "seoDescription", "seoKeywords": string[]
}
Title: ${input.title}
Industry: ${input.clientIndustry ?? ""}
Service: ${input.serviceType ?? ""}
Problem notes: ${input.problemNotes ?? ""}
Solution notes: ${input.solutionNotes ?? ""}
Result notes: ${input.resultNotes ?? ""}`,
  });
}

export async function generateBlogContent(
  input: {
    topic: string;
    audience?: string;
    keywords?: string[];
    tone?: string;
  },
  adminId?: string,
) {
  const fallback = {
    title: input.topic,
    excerpt: "",
    content: "",
    tags: input.keywords ?? [],
    seoTitle: `${input.topic} | AIVRASOL`,
    seoDescription: "",
    seoKeywords: input.keywords ?? [],
    _aiFallback: true,
  };

  return runStructuredGeneration({
    feature: "admin_content_generate",
    adminId,
    metadata: { type: "blog" },
    fallback,
    system: `${BRAND_VOICE} Return valid JSON only.`,
    user: `Generate blog draft JSON: { title, excerpt, content, tags, seoTitle, seoDescription, seoKeywords }
Topic: ${input.topic}
Audience: ${input.audience ?? "tech and business leaders"}
Keywords: ${(input.keywords ?? []).join(", ")}
Tone: ${input.tone ?? "insightful"}`,
  });
}

export async function generateFAQContent(
  input: {
    serviceName: string;
    audience?: string;
    keywords?: string[];
  },
  adminId?: string,
) {
  const fallback = {
    faqs: [] as Array<{ question: string; answer: string; category: string }>,
    _aiFallback: true,
  };

  return runStructuredGeneration({
    feature: "admin_content_generate",
    adminId,
    metadata: { type: "faq" },
    fallback,
    system: `${BRAND_VOICE} Return valid JSON only.`,
    user: `Generate 5-8 FAQs as JSON: { "faqs": [{ "question", "answer", "category" }] }
Service: ${input.serviceName}
Audience: ${input.audience ?? "prospective clients"}
Keywords: ${(input.keywords ?? []).join(", ")}`,
  });
}

export async function generateSEOContent(
  input: {
    pageType: string;
    title: string;
    description?: string;
    keywords?: string[];
  },
  adminId?: string,
) {
  const fallback = {
    seoTitle: `${input.title} | AIVRASOL`,
    seoDescription: input.description?.slice(0, 160) ?? "",
    seoKeywords: input.keywords ?? [],
    suggestedSchemaType: "WebPage",
    _aiFallback: true,
  };

  return runStructuredGeneration({
    feature: "seo_generate",
    adminId,
    metadata: { type: "seo", pageType: input.pageType },
    fallback,
    system: `${BRAND_VOICE} Return valid JSON only.`,
    user: `Generate SEO metadata JSON:
{ "seoTitle", "seoDescription" (max 160 chars), "seoKeywords": string[], "suggestedSchemaType" }
Page type: ${input.pageType}
Title: ${input.title}
Description: ${input.description ?? ""}
Keywords: ${(input.keywords ?? []).join(", ")}`,
  });
}

export async function generateContactMessage(input: {
  name?: string;
  serviceInterest: string;
  roughIdea: string;
  tone?: string;
}) {
  const fallback = {
    generatedMessage: `Hi AIVRASOL team,\n\nI'm interested in ${input.serviceInterest}. ${input.roughIdea}\n\nBest regards${input.name ? `,\n${input.name}` : ""}`,
    _aiFallback: true,
  };

  const system = `${BRAND_VOICE} Help the user write a concise, professional inquiry email. Return JSON: { "generatedMessage": string }`;
  const user = `Service interest: ${input.serviceInterest}
Rough idea: ${input.roughIdea}
Tone: ${input.tone ?? "professional"}
Name: ${input.name ?? "not provided"}`;

  try {
    const result = await chatCompletion({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.5,
      maxTokens: 800,
      responseFormat: "json_object",
    });

    const parsed = parseJsonContent<{ generatedMessage: string }>(
      result.content,
      fallback,
    );

    await logAiCall({
      feature: "contact_email_assist",
      prompt: user,
      response: result.content,
      model: result.model,
      tokensUsed: result.tokensUsed,
      status: "success",
    });

    return parsed;
  } catch (error) {
    await logAiCall({
      feature: "contact_email_assist",
      prompt: user,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "failed",
    });
    return fallback;
  }
}

export async function buildAivaPublicContext() {
  await connectDB();
  const [services, projects, faqs, settings] = await Promise.all([
    Service.find({ isActive: true })
      .select("title slug shortDescription")
      .limit(12)
      .lean(),
    Project.find({ isActive: true })
      .select("title slug shortDescription industry")
      .limit(8)
      .lean(),
    FAQ.find({ isActive: true })
      .select("question answer category")
      .limit(15)
      .lean(),
    getPublicSettingsMap(),
  ]);

  return {
    companyName: settings.companyName ?? "AIVRASOL",
    tagline: settings.tagline ?? "Premium AI & digital services",
    services,
    projects,
    faqs,
    contactEmail: settings.contactEmail,
  };
}

export async function aivaChat(input: {
  message: string;
  sessionId?: string;
  pageContext?: string;
  currentPage?: string;
}) {
  const context = await buildAivaPublicContext();

  const contextBlock = JSON.stringify(
    {
      company: context.companyName,
      tagline: context.tagline,
      services: context.services.map((s) => ({
        title: s.title,
        slug: s.slug,
        summary: s.shortDescription,
      })),
      projects: context.projects.map((p) => ({
        title: p.title,
        slug: p.slug,
        industry: p.industry,
      })),
      faqs: context.faqs.slice(0, 8),
    },
    null,
    0,
  );

  const system = `You are AIVA, the public guide for AIVRASOL.
${BRAND_VOICE}
Rules:
- Only use information from the PUBLIC_CONTEXT JSON below.
- If unsure, say you don't have that detail and suggest contacting the team.
- For pricing, explain scope varies and recommend contact.
- Redirect off-topic questions politely to AIVRASOL services.
- Return JSON only: {
  "reply": string,
  "suggestedActions": string[],
  "leadIntent": "low"|"medium"|"high",
  "recommendedServiceSlug": string|null
}`;

  const user = `PUBLIC_CONTEXT:\n${contextBlock}\n\nUser page: ${input.currentPage ?? "unknown"}\nContext: ${input.pageContext ?? ""}\n\nUser message: ${input.message}`;

  const fallback = {
    reply:
      "Thanks for reaching out to AIVRASOL. I can help you explore our AI and digital services. Tell me what you're building, or visit our contact page to speak with the team.",
    suggestedActions: ["View services", "Contact us"],
    leadIntent: "medium" as const,
    recommendedServiceSlug: context.services[0]?.slug ?? null,
    _aiFallback: true,
  };

  try {
    const result = await chatCompletion({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.5,
      maxTokens: 900,
      responseFormat: "json_object",
    });

    const parsed = parseJsonContent<typeof fallback>(result.content, fallback);

    await logAiCall({
      feature: "chatbot",
      prompt: input.message,
      response: result.content,
      model: result.model,
      tokensUsed: result.tokensUsed,
      status: "success",
      metadata: { sessionId: input.sessionId },
    });

    return parsed;
  } catch (error) {
    await logAiCall({
      feature: "chatbot",
      prompt: input.message,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "failed",
      metadata: { sessionId: input.sessionId },
    });
    return fallback;
  }
}

/** @deprecated */
export async function createLongCatCompletion(
  options: ChatCompletionInput,
): Promise<{ content: string }> {
  const result = await chatCompletion(options);
  return { content: result.content };
}

export function getAiUnavailableMessage(): string {
  return "AI is temporarily unavailable. A draft template was returned instead.";
}
