import { describe, expect, it } from "vitest";

import {
  OVERTURE_SESSION_KEY,
  hasPlayedOverture,
  markOverturePlayed,
} from "./session";

function fakeStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => [...map.keys()][i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, v),
  } as Storage;
}

function throwingStorage(): Storage {
  // Safari in private mode throws on both read and write.
  return {
    get length(): number {
      throw new Error("SecurityError");
    },
    clear: () => {
      throw new Error("SecurityError");
    },
    getItem: () => {
      throw new Error("SecurityError");
    },
    key: () => {
      throw new Error("SecurityError");
    },
    removeItem: () => {
      throw new Error("SecurityError");
    },
    setItem: () => {
      throw new Error("SecurityError");
    },
  } as unknown as Storage;
}

describe("overture session gate", () => {
  it("reports not played on a fresh session", () => {
    expect(hasPlayedOverture(fakeStorage())).toBe(false);
  });

  it("reports played once marked", () => {
    const storage = fakeStorage();
    markOverturePlayed(storage);
    expect(storage.getItem(OVERTURE_SESSION_KEY)).toBe("1");
    expect(hasPlayedOverture(storage)).toBe(true);
  });

  it("treats missing storage as not played", () => {
    expect(hasPlayedOverture(undefined)).toBe(false);
    expect(hasPlayedOverture(null)).toBe(false);
  });

  it("never throws when storage is unavailable", () => {
    const storage = throwingStorage();
    expect(() => markOverturePlayed(storage)).not.toThrow();
    // A browser that cannot remember should get the sequence, not a crash.
    expect(hasPlayedOverture(storage)).toBe(false);
  });
});
