/**
 * Generate iCalendar (.ics) file content for a booking.
 */

import { SITE } from "./utils";

interface IcsArgs {
  uid: string;
  startUtc: Date;
  durationMin?: number;
  summary: string;
  description: string;
  location?: string;
  organizerEmail?: string;
  organizerName?: string;
  attendeeEmail?: string;
  attendeeName?: string;
}

function fmt(d: Date): string {
  return (
    d.getUTCFullYear().toString().padStart(4, "0") +
    (d.getUTCMonth() + 1).toString().padStart(2, "0") +
    d.getUTCDate().toString().padStart(2, "0") +
    "T" +
    d.getUTCHours().toString().padStart(2, "0") +
    d.getUTCMinutes().toString().padStart(2, "0") +
    d.getUTCSeconds().toString().padStart(2, "0") +
    "Z"
  );
}

function escape(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function generateIcs(args: IcsArgs): string {
  const start = args.startUtc;
  const end = new Date(start.getTime() + (args.durationMin ?? 30) * 60000);
  const now = new Date();

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE.name}//${SITE.url}//VI`,
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${args.uid}`,
    `DTSTAMP:${fmt(now)}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${escape(args.summary)}`,
    `DESCRIPTION:${escape(args.description)}`,
  ];
  if (args.location) lines.push(`LOCATION:${escape(args.location)}`);
  if (args.organizerEmail) {
    lines.push(
      `ORGANIZER;CN=${escape(args.organizerName ?? args.organizerEmail)}:mailto:${args.organizerEmail}`,
    );
  }
  if (args.attendeeEmail) {
    lines.push(
      `ATTENDEE;CN=${escape(args.attendeeName ?? args.attendeeEmail)};RSVP=TRUE:mailto:${args.attendeeEmail}`,
    );
  }
  lines.push("STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}
