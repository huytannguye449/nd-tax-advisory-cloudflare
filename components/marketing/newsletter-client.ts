const DISMISSED_UNTIL_KEY = "nhnd_newsletter_popup_dismissed_until";
const SUBSCRIBED_UNTIL_KEY = "nhnd_newsletter_subscribed_until";

const DAY = 24 * 60 * 60 * 1000;

function storage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function readTimestamp(key: string) {
  const store = storage();
  if (!store) return 0;
  const value = Number(store.getItem(key) ?? "0");
  return Number.isFinite(value) ? value : 0;
}

function writeTimestamp(key: string, days: number) {
  const store = storage();
  if (!store) return;
  store.setItem(key, String(Date.now() + days * DAY));
}

export function shouldShowNewsletterPopup() {
  const now = Date.now();
  return (
    readTimestamp(DISMISSED_UNTIL_KEY) <= now &&
    readTimestamp(SUBSCRIBED_UNTIL_KEY) <= now
  );
}

export function markNewsletterDismissed() {
  writeTimestamp(DISMISSED_UNTIL_KEY, 7);
}

export function markNewsletterSubscribed() {
  writeTimestamp(SUBSCRIBED_UNTIL_KEY, 30);
}

export async function subscribeToNewsletter(email: string, source: string) {
  const res = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
  };
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Không đăng ký được newsletter.");
  }
  markNewsletterSubscribed();
  return data;
}
