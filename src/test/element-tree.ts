// Test-only helpers for asserting on a React element tree without rendering it.
//
// The Open Graph cards are never mounted in a DOM — Satori consumes the element
// tree directly — so the honest thing to assert on is the tree itself: which
// element carries which style, and which slot holds which string.

import { isValidElement, type ReactElement, type ReactNode } from "react";

export type Style = Record<string, unknown>;

/** Every element in the tree, parents before children. */
export function elements(node: ReactNode): ReactElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!isValidElement(node)) return [];
  const props = node.props as { children?: ReactNode };
  return [node, ...elements(props.children)];
}

/** The inline style object of every element that has one. */
export function styles(node: ReactNode): Style[] {
  return elements(node)
    .map((el) => styleOf(el))
    .filter((style): style is Style => Boolean(style));
}

export function styleOf(node: ReactNode): Style | undefined {
  return isValidElement(node)
    ? (node.props as { style?: Style }).style
    : undefined;
}

/** All text content, flattened. */
export function text(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join(" ");
  if (!isValidElement(node)) return "";
  return text((node.props as { children?: ReactNode }).children);
}

/** Every hex colour literal appearing anywhere in any inline style. */
export function hexes(node: ReactNode): string[] {
  return styles(node)
    .flatMap((style) => Object.values(style))
    .filter((value): value is string => typeof value === "string")
    .flatMap((value) => value.match(/#[0-9a-fA-F]{3,8}/g) ?? []);
}
