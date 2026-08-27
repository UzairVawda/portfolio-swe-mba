// The overture runs once per session and never replays on back-navigation.
// sessionStorage is the right scope: it survives client-side navigation and
// reloads within the tab, and resets when the tab closes.
//
// Storage is passed in rather than read from `window` so this is testable
// without globals — and every access is guarded, because Safari in private
// mode throws on both read and write.

export const OVERTURE_SESSION_KEY = "uv:overture-played";

export function hasPlayedOverture(storage?: Storage | null): boolean {
  if (!storage) return false;
  try {
    return storage.getItem(OVERTURE_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markOverturePlayed(storage?: Storage | null): void {
  if (!storage) return;
  try {
    storage.setItem(OVERTURE_SESSION_KEY, "1");
  } catch {
    // A browser that refuses to remember gets the sequence again. Acceptable.
  }
}
