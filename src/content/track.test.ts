import { describe, expect, it } from "vitest";

import { findItem, speaking, tools, trackCopy, type TrackItem } from "./track";

// Both collections ship empty, so a per-item loop over the real content
// asserts nothing today. The guards below are therefore written as pure
// functions and tested twice: once against the real collections (which must
// report no violations) and once against deliberately broken fixtures (which
// must report the exact violation). The second half is what keeps the first
// half honest — a guard that cannot fail is not a guard.

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function itemViolations(item: TrackItem): string[] {
  const problems: string[] = [];
  if (!SLUG.test(item.slug)) problems.push(`slug "${item.slug}" is not url-safe`);
  if (item.title.trim().length === 0) problems.push(`${item.slug}: empty title`);
  if (!ISO_DATE.test(item.date) || Number.isNaN(Date.parse(item.date))) {
    problems.push(`${item.slug}: "${item.date}" is not an ISO calendar date`);
  }
  if (item.blurb.length <= 20) problems.push(`${item.slug}: blurb is too short`);
  if (item.blurb.length > 280) problems.push(`${item.slug}: blurb is too long`);
  if (item.image && item.image.alt.trim().length === 0) {
    problems.push(`${item.slug}: image has no alt text`);
  }
  if (item.link && item.link.label.trim().length === 0) {
    problems.push(`${item.slug}: link has no label`);
  }
  if (item.link && !/^(https?:\/\/|\/)/.test(item.link.href)) {
    problems.push(`${item.slug}: link href "${item.link.href}" is not absolute`);
  }
  return problems;
}

function collectionViolations(items: TrackItem[]): string[] {
  const problems = items.flatMap(itemViolations);
  const slugs = items.map((item) => item.slug);
  if (new Set(slugs).size !== slugs.length) problems.push("duplicate slugs");
  const dates = items.map((item) => item.date);
  if (dates.join() !== [...dates].sort().reverse().join()) {
    problems.push("not ordered newest first");
  }
  return problems;
}

const validItem: TrackItem = {
  slug: "it-strategy-maturity-assessment",
  title: "IT maturity assessment",
  date: "2026-12-18",
  blurb: "A scoring tool built alongside CIS 9000, sized for one afternoon.",
  image: { src: { src: "/x.png", height: 630, width: 1200 }, alt: "Screenshot" },
  link: { label: "Open the tool", href: "https://example.com/tool" },
};

function withItem(overrides: Partial<TrackItem>): TrackItem {
  return { ...validItem, ...overrides };
}

// Every collection the module publishes, checked by the same guards. Adding a
// third collection to track.ts without adding it here is the one gap this
// table cannot close, so keep it in sync.
const collections: Array<[string, TrackItem[]]> = [
  ["tools", tools],
  ["speaking", speaking],
];

describe("track collections", () => {
  for (const [name, items] of collections) {
    it(`${name} satisfies every item and ordering invariant`, () => {
      expect(collectionViolations(items)).toEqual([]);
    });
  }

  // Guards the collections against aspirational placeholder content: an item
  // may only appear here once it actually exists, which is the same promise
  // the empty-state copy makes to the reader.
  it("ships both collections genuinely empty", () => {
    expect(tools).toEqual([]);
    expect(speaking).toEqual([]);
  });

  it("types both collections as the same shape", () => {
    expect(Array.isArray(tools)).toBe(true);
    expect(Array.isArray(speaking)).toBe(true);
    expect(tools).not.toBe(speaking);
  });
});

describe("the collection guards themselves", () => {
  it("passes a well-formed item", () => {
    expect(itemViolations(validItem)).toEqual([]);
    expect(collectionViolations([validItem])).toEqual([]);
  });

  it.each([
    ["an upper-case slug", { slug: "IT-Strategy" }, /not url-safe/],
    ["an underscored slug", { slug: "it_strategy" }, /not url-safe/],
    ["a trailing-dash slug", { slug: "it-strategy-" }, /not url-safe/],
    ["an empty title", { title: "  " }, /empty title/],
    ["a US-format date", { date: "12/18/2026" }, /ISO calendar date/],
    ["an impossible date", { date: "2026-13-45" }, /ISO calendar date/],
    ["a one-word blurb", { blurb: "Soon." }, /blurb is too short/],
    ["a 281-char blurb", { blurb: "x".repeat(281) }, /blurb is too long/],
    [
      "an image with no alt",
      { image: { src: validItem.image!.src, alt: "" } },
      /no alt text/,
    ],
    [
      "a relative link href",
      { link: { label: "Read", href: "example.com" } },
      /is not absolute/,
    ],
    ["an unlabelled link", { link: { label: "", href: "/a" } }, /no label/],
  ] as Array<[string, Partial<TrackItem>, RegExp]>)(
    "rejects %s",
    (_name, overrides, pattern) => {
      const problems = itemViolations(withItem(overrides));
      expect(problems).toHaveLength(1);
      expect(problems[0]).toMatch(pattern);
    },
  );

  it("rejects duplicate slugs across a collection", () => {
    const dupes = [withItem({ date: "2026-12-18" }), withItem({ date: "2026-01-02" })];
    expect(collectionViolations(dupes)).toContain("duplicate slugs");
  });

  it("rejects oldest-first ordering", () => {
    const wrong = [
      withItem({ slug: "older", date: "2026-01-02" }),
      withItem({ slug: "newer", date: "2026-12-18" }),
    ];
    expect(collectionViolations(wrong)).toContain("not ordered newest first");
    expect(collectionViolations([...wrong].reverse())).toEqual([]);
  });
});

describe("findItem", () => {
  const items = [
    withItem({ slug: "market-sizing", title: "Market sizing", date: "2026-12-18" }),
    withItem({ slug: "five-forces", title: "Five forces", date: "2026-06-01" }),
  ];

  it("returns the item whose slug matches exactly", () => {
    expect(findItem(items, "five-forces")).toBe(items[1]);
    expect(findItem(items, "market-sizing")).toBe(items[0]);
  });

  it("returns undefined for a slug that is not present", () => {
    expect(findItem(items, "definitely-not-here")).toBeUndefined();
  });

  it("does not match on a prefix, a substring, or a title", () => {
    expect(findItem(items, "five")).toBeUndefined();
    expect(findItem(items, "forces")).toBeUndefined();
    expect(findItem(items, "Five forces")).toBeUndefined();
    expect(findItem(items, "")).toBeUndefined();
  });

  it("returns undefined from an empty collection", () => {
    expect(findItem([], "market-sizing")).toBeUndefined();
    expect(findItem(tools, "market-sizing")).toBeUndefined();
    expect(findItem(speaking, "market-sizing")).toBeUndefined();
  });
});

describe("trackCopy", () => {
  const galleries = ["tools", "speaking"] as const;

  function strings(value: unknown, out: string[] = []): string[] {
    if (typeof value === "string") out.push(value);
    else if (value && typeof value === "object") {
      for (const inner of Object.values(value)) strings(inner, out);
    }
    return out;
  }

  it("carries section copy for the track as a whole", () => {
    expect(trackCopy.section.heading.length).toBeGreaterThan(0);
    expect(trackCopy.section.body.length).toBeGreaterThan(40);
  });

  it.each(galleries)("carries gallery copy for %s", (key) => {
    expect(trackCopy[key].heading.length).toBeGreaterThan(0);
    expect(trackCopy[key].body.length).toBeGreaterThan(0);
  });

  it.each(galleries)("carries an empty state for %s", (key) => {
    expect(trackCopy[key].empty.title.length).toBeGreaterThan(0);
    expect(trackCopy[key].empty.body.length).toBeGreaterThan(0);
  });

  // The empty states are the reader-facing version of the promise the
  // collections keep: nothing is published before it exists. Copy that hedges
  // with a launch tease breaks that promise, so it is banned outright.
  it.each(galleries)("states plainly that %s is empty, without a tease", (key) => {
    const empty = `${trackCopy[key].empty.title} ${trackCopy[key].empty.body}`;
    expect(empty).toMatch(/\b(no|none|nothing|empty|yet)\b/i);
    expect(empty).not.toMatch(
      /coming soon|stay tuned|check back|watch this space|under construction|launching soon/i,
    );
  });

  it("keeps every string in the copy trimmed and non-empty", () => {
    const all = strings(trackCopy);
    expect(all.length).toBeGreaterThan(8);
    for (const value of all) {
      expect(value).toBe(value.trim());
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it("exposes exactly the section and the two galleries", () => {
    expect(Object.keys(trackCopy).sort()).toEqual(["section", "speaking", "tools"]);
  });
});
