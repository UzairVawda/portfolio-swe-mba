// Formats a TrackItem's ISO date as a short human label. Fixed to en-US and
// UTC so the server render and the client render agree — a locale-sensitive
// format hydrates differently for a visitor in another timezone.
//
// Shared by the card and the permalink so the same item never shows two
// different dates depending on which page you are looking at.

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function formatTrackDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? iso : dateFormat.format(parsed);
}
