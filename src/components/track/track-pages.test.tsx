// The two routes, rendered with the real (currently empty) collections. This
// is deliberately not fixture-driven: the point is to assert what an actual
// visitor to /tools and /speaking gets today, which is the empty state.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import SpeakingPage, { metadata as speakingMetadata } from "@/app/speaking/page";
import ToolsPage, { metadata as toolsMetadata } from "@/app/tools/page";
import { speaking, tools, trackCopy } from "@/content/track";

// Phrasings that promise unshipped work. The copy itself is guarded in
// track.test.ts; this guards everything the gallery adds around it.
const TEASING =
  /coming soon|stay tuned|watch this space|in the works|launching soon|under construction|check back/i;

function render(node: React.ReactElement): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(node);
  return host;
}

const pages = [
  {
    name: "/tools",
    node: ToolsPage(),
    metadata: toolsMetadata,
    testId: "page-tools",
    copy: trackCopy.tools,
    collection: tools,
  },
  {
    name: "/speaking",
    node: SpeakingPage(),
    metadata: speakingMetadata,
    testId: "page-speaking",
    copy: trackCopy.speaking,
    collection: speaking,
  },
] as const;

it("covers both gallery routes", () => {
  expect(pages).toHaveLength(2);
});

describe.each(pages)("$name", ({ node, metadata, testId, copy, collection }) => {
  const root = render(node);

  it("carries its page testid", () => {
    expect(root.querySelector(`[data-testid="${testId}"]`)).not.toBeNull();
  });

  it("renders the collection's heading and body", () => {
    expect(root.querySelector("h1")?.textContent).toBe(copy.heading);
    expect(root.textContent).toContain(copy.body);
  });

  it("renders exactly one card per published item", () => {
    expect(root.querySelectorAll('[data-testid="gallery-item"]')).toHaveLength(
      collection.length,
    );
  });

  it("shows the honest empty state while the collection is empty", () => {
    const emptyPanel = root.querySelector('[data-testid="gallery-empty"]');
    if (collection.length > 0) {
      expect(emptyPanel).toBeNull();
      return;
    }
    expect(emptyPanel).not.toBeNull();
    expect(emptyPanel?.textContent).toContain(copy.empty.title);
    expect(emptyPanel?.textContent).toContain(copy.empty.body);
    // The way out has to actually point somewhere with content on it.
    expect(
      root.querySelector('[data-testid="gallery-empty-link"]')
        ?.getAttribute("href"),
    ).toBe("/#work");
  });

  it("promises nothing it has not shipped", () => {
    expect(root.textContent ?? "").not.toMatch(TEASING);
  });

  it("titles the document without repeating the site name", () => {
    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeGreaterThan(0);
    expect(metadata.title).not.toMatch(/Uzair/);
    expect(metadata.description).toBe(copy.body);
  });
});
