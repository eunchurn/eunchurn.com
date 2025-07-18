import { ExtendedRecordMap } from "notion-types";

// Simple in-memory cache for build time
const cache = new Map<string, { data: ExtendedRecordMap; timestamp: number }>();

// Cache for 30 minutes during build
const CACHE_DURATION = 30 * 60 * 1000;

export function getCachedPage(pageId: string): ExtendedRecordMap | null {
  const cached = cache.get(pageId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

export function setCachedPage(pageId: string, data: ExtendedRecordMap): void {
  cache.set(pageId, { data, timestamp: Date.now() });
}

export function clearCache(): void {
  cache.clear();
}
