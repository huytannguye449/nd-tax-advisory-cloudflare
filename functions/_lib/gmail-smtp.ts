import { connect } from "cloudflare:sockets";

export interface GmailSmtpEnv {
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_SECURE?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM_EMAIL?: string;
}

export interface GmailSmtpArgs {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface GmailSmtpResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
  smtpCode?: number;
}

class SmtpProtocolError extends Error {
  code?: number;

  constructor(message: string, code?: number) {
    super(message);
    this.name = "SmtpProtocolError";
    this.code = code;
  }
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
}

function requireSmtpConfig(env: GmailSmtpEnv): SmtpConfig {
  const host = env.SMTP_HOST?.trim();
  const portRaw = env.SMTP_PORT?.trim();
  const secureRaw = env.SMTP_SECURE?.trim().toLowerCase();
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS?.replace(/\s+/g, "");
  const fromEmail = env.SMTP_FROM_EMAIL?.trim();

  const missing = [
    ["SMTP_HOST", host],
    ["SMTP_PORT", portRaw],
    ["SMTP_SECURE", secureRaw],
    ["SMTP_USER", user],
    ["SMTP_PASS", pass],
    ["SMTP_FROM_EMAIL", fromEmail],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `EMAIL_PROVIDER=gmail_smtp requires ${missing.join(", ")}.`,
    );
  }

  const port = Number(portRaw);
  const secure = secureRaw === "true";
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a valid positive integer.");
  }
  if (!secure || port !== 465) {
    throw new Error(
      "gmail_smtp currently supports SMTP_SECURE=true with SMTP_PORT=465 only.",
    );
  }

  return {
    host: host!,
    port,
    secure,
    user: user!,
    pass: pass!,
    fromEmail: fromEmail!,
  };
}

function normalizeRecipients(value: string | string[]) {
  const recipients = (Array.isArray(value) ? value : [value])
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const invalid = recipients.find(
    (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  );
  if (invalid) throw new Error(`Invalid email recipient: ${invalid}`);
  if (recipients.length === 0) throw new Error("At least one recipient is required.");
  return Array.from(new Set(recipients));
}

function base64Utf8(value: string) {
  const bytes = new TextEncoder().encode(value.normalize("NFC"));
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function encodeHeader(value: string) {
  const normalized = value.normalize("NFC");
  if (/^[\x20-\x7e]*$/.test(normalized)) return normalized;
  return `=?UTF-8?B?${base64Utf8(normalized)}?=`;
}

function formatAddress(label: string, email: string) {
  return `${encodeHeader(label)} <${email}>`;
}

function normalizeMessageBody(value: string) {
  return value.normalize("NFC").replace(/\r?\n/g, "\r\n");
}

function dotStuff(value: string) {
  return normalizeMessageBody(value)
    .split("\r\n")
    .map((line) => (line.startsWith(".") ? `.${line}` : line))
    .join("\r\n");
}

function wrapBase64(value: string) {
  return value.match(/.{1,76}/g)?.join("\r\n") ?? "";
}

function buildMimeMessage(
  config: SmtpConfig,
  recipients: string[],
  args: GmailSmtpArgs,
) {
  const domain = config.fromEmail.split("@")[1] || "gmail.local";
  const messageId = `${crypto.randomUUID()}@${domain}`;
  const headers = [
    `From: ${formatAddress("NHN&D Tax Advisory", config.fromEmail)}`,
    `To: ${recipients.join(", ")}`,
    args.replyTo ? `Reply-To: ${args.replyTo.trim()}` : null,
    `Subject: ${encodeHeader(args.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${messageId}>`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
  ].filter((item): item is string => Boolean(item));

  const encodedHtml = wrapBase64(base64Utf8(args.html));

  return {
    messageId,
    raw: `${headers.join("\r\n")}\r\n\r\n${dotStuff(encodedHtml)}\r\n`,
  };
}

function sanitizeLine(line: string) {
  return line.replace(/[\r\n]/g, " ").trim();
}

export async function sendGmailSmtpEmail(
  env: GmailSmtpEnv,
  args: GmailSmtpArgs,
): Promise<GmailSmtpResult> {
  const config = requireSmtpConfig(env);
  const recipients = normalizeRecipients(args.to);
  const socket = connect(
    { hostname: config.host, port: config.port },
    { secureTransport: "on", allowHalfOpen: false },
  );
  const reader = socket.readable.getReader();
  const writer = socket.writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = "";

  async function readLine() {
    while (true) {
      const index = buffer.indexOf("\n");
      if (index >= 0) {
        const line = buffer.slice(0, index + 1);
        buffer = buffer.slice(index + 1);
        return sanitizeLine(line);
      }

      const chunk = await reader.read();
      if (chunk.done) throw new SmtpProtocolError("SMTP connection closed unexpectedly.");
      buffer += decoder.decode(chunk.value, { stream: true });
    }
  }

  async function readResponse(expected: number[]) {
    const lines: string[] = [];
    let code: number | undefined;

    while (true) {
      const line = await readLine();
      lines.push(line);
      const match = /^(\d{3})([ -])/.exec(line);
      if (!match) continue;
      code = Number(match[1]);
      if (match[2] === " ") break;
    }

    if (!code || !expected.includes(code)) {
      throw new SmtpProtocolError(lines.join(" | "), code);
    }
    return { code, lines };
  }

  async function writeRaw(value: string) {
    await writer.write(encoder.encode(value));
  }

  async function command(value: string, expected: number[]) {
    await writeRaw(`${value}\r\n`);
    return readResponse(expected);
  }

  try {
    await readResponse([220]);
    await command("EHLO ndtax.local", [250]);
    await command(`AUTH PLAIN ${base64Utf8(`\0${config.user}\0${config.pass}`)}`, [
      235,
    ]);
    await command(`MAIL FROM:<${config.fromEmail}>`, [250]);
    for (const recipient of recipients) {
      await command(`RCPT TO:<${recipient}>`, [250, 251]);
    }
    await command("DATA", [354]);

    const message = buildMimeMessage(config, recipients, args);
    await writeRaw(`${message.raw}\r\n.\r\n`);
    const dataResponse = await readResponse([250]);
    await command("QUIT", [221]).catch(() => null);

    console.log("[email-gmail-smtp-send]", {
      recipients,
      subject: args.subject,
      smtp_code: dataResponse.code,
      message_id: message.messageId,
    });

    return {
      messageId: message.messageId,
      accepted: recipients,
      rejected: [],
      smtpCode: dataResponse.code,
    };
  } finally {
    reader.releaseLock();
    writer.releaseLock();
    socket.close();
  }
}
