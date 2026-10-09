/**
 * Tiny key/value store:
 * - Cloudflare Workers: KV binding DUETBOOTH_KV
 * - Local / Node: JSON files under data/kv/
 */

import { promises as fs } from "fs";
import path from "path";

type KvNamespaceLike = {
  get(key: string, type: "json"): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
};

const FILE_DIR = path.join(process.cwd(), "data", "kv");

function filePathFor(key: string) {
  const safe = key.replace(/[^a-zA-Z0-9._:-]/g, "_");
  return path.join(FILE_DIR, `${safe}.json`);
}

async function getCloudflareKv(): Promise<KvNamespaceLike | null> {
  try {
    // Static import so OpenNext bundles this into the Worker (dynamic
    // `import()` via Function was silently failing → file fallback → EPERM).
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    const kv = (ctx?.env as { DUETBOOTH_KV?: KvNamespaceLike } | undefined)
      ?.DUETBOOTH_KV;
    return kv ?? null;
  } catch {
    return null;
  }
}

async function fileGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePathFor(key), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function filePut(key: string, value: unknown): Promise<void> {
  await fs.mkdir(FILE_DIR, { recursive: true });
  const target = filePathFor(key);
  const tmp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value), "utf8");
  await fs.rename(tmp, target);
}

export async function storeGet<T>(key: string): Promise<T | null> {
  const kv = await getCloudflareKv();
  if (kv) {
    const value = await kv.get(key, "json");
    return (value as T) ?? null;
  }
  return fileGet<T>(key);
}

export async function storePut(key: string, value: unknown): Promise<void> {
  const kv = await getCloudflareKv();
  if (kv) {
    await kv.put(key, JSON.stringify(value));
    return;
  }
  await filePut(key, value);
}

export async function storeBackend(): Promise<"kv" | "file"> {
  return (await getCloudflareKv()) ? "kv" : "file";
}
