export type EmailProvider = "mock" | "resend" | "unsupported";
export type EmailDeliveryStatus = "mocked" | "sent";
export type EmailRuntime = "worker" | "node";

export interface EmailEnv {
  EMAIL_PROVIDER?: string;
  EMAIL_AUTOMATION_DISABLED?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

export interface SendEmailArgs {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  category?: "newsletter" | "transactional";
}

export type SendEmailResult =
  | {
      ok: true;
      provider: EmailProvider;
      status: EmailDeliveryStatus;
      runtime: EmailRuntime;
      messageId?: string;
      accepted?: string[];
      rejected?: string[];
    }
  | {
      ok: false;
      provider: EmailProvider;
      runtime: EmailRuntime;
      error: string;
      statusCode?: number;
    };

export function resolveEmailProvider(env: EmailEnv): EmailProvider {
  const provider = env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (!provider || provider === "mock") return "mock";
  if (provider === "resend") return "resend";
  return "unsupported";
}

function detectRuntime(): EmailRuntime {
  const global = globalThis as {
    process?: { versions?: { node?: string } };
    WebSocketPair?: unknown;
  };
  if (global.process?.versions?.node && !("WebSocketPair" in global)) {
    return "node";
  }
  return "worker";
}

function recipients(value: string | string[]) {
  return Array.isArray(value) ? value : [value];
}

function automationDisabled(env: EmailEnv) {
  return env.EMAIL_AUTOMATION_DISABLED?.trim().toLowerCase() === "true";
}

function compactSnippet(value: string | undefined, maxLength = 600) {
  if (!value) return "";
  const compacted = value.replace(/\s+/g, " ").trim();
  return compacted.length > maxLength
    ? `${compacted.slice(0, maxLength)}...`
    : compacted;
}

function extractLinks(html: string) {
  const links = new Set<string>();
  const re = /href=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    if (match[1]) links.add(match[1]);
  }
  return Array.from(links);
}

function logMockEmail(args: SendEmailArgs) {
  const links = extractLinks(args.html);
  const prefix =
    args.category === "newsletter" ? "[newsletter-mock-send]" : "[email-mock-send]";

  console.log(prefix, {
    recipients: recipients(args.to),
    subject: args.subject,
    cta_links: links.filter((link) => !link.includes("/unsubscribe")).slice(0, 5),
    unsubscribe_links: links.filter((link) => link.includes("/unsubscribe")),
    text_preview: compactSnippet(args.text),
    html_preview: compactSnippet(args.html),
  });
}

function logDisabledEmail(provider: EmailProvider, runtime: EmailRuntime, args: SendEmailArgs) {
  console.log("[email-disabled]", {
    provider,
    runtime,
    recipients: recipients(args.to),
    subject: args.subject,
  });
}

export async function sendEmail(
  env: EmailEnv,
  args: SendEmailArgs,
): Promise<SendEmailResult> {
  const provider = resolveEmailProvider(env);
  const runtime = detectRuntime();

  if (automationDisabled(env)) {
    logDisabledEmail(provider, runtime, args);
    return { ok: true, provider, runtime, status: "mocked" };
  }

  if (provider === "unsupported") {
    return {
      ok: false,
      provider,
      runtime,
      error:
        "Unsupported EMAIL_PROVIDER. Use EMAIL_PROVIDER=mock for local development or EMAIL_PROVIDER=resend for production email delivery.",
    };
  }

  if (provider === "mock") {
    logMockEmail(args);
    return { ok: true, provider, runtime, status: "mocked" };
  }

  const apiKey = env.RESEND_API_KEY?.trim();
  const fromEmail = env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !fromEmail) {
    return {
      ok: false,
      provider,
      runtime,
      error:
        "EMAIL_PROVIDER=resend requires RESEND_API_KEY and RESEND_FROM_EMAIL. Set EMAIL_PROVIDER=mock for local development.",
    };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `NHN&D Tax Advisory <${fromEmail}>`,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      reply_to: args.replyTo,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let message = body || `Resend error ${res.status}`;
    try {
      const parsed = JSON.parse(body) as {
        message?: string;
        name?: string;
        error?: string;
      };
      message = parsed.message ?? parsed.error ?? body;
      if (parsed.name) message = `${parsed.name}: ${message}`;
    } catch {
      // Keep raw body when Resend does not return JSON.
    }
    console.error("[email-resend-error]", {
      recipients: recipients(args.to),
      subject: args.subject,
      status: res.status,
      error: message,
    });
    return { ok: false, provider, runtime, error: message, statusCode: res.status };
  }

  const data = (await res.json().catch(() => null)) as { id?: string } | null;
  return { ok: true, provider, runtime, status: "sent", messageId: data?.id };
}
