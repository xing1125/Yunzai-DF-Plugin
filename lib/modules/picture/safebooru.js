import { request as requestUtil } from "../../utils/index.js";

const MIN_SIZE = 1000;
const CACHE_TTL = 10 * 60 * 1000;
const cache = new Map(); // tag -> { ts, photos }
const recent = [];

async function fetchPhotos(tag) {
  const now = Date.now();
  const hit = cache.get(tag);
  if (hit && now - hit.ts < CACHE_TTL) return hit.photos;
  const api = `https://safebooru.org/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(tag)}&limit=60&json=1`;
  const list = await requestUtil.get(api, "json", {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const photos = Array.isArray(list)
    ? list.filter(p => p.width >= MIN_SIZE && p.height >= MIN_SIZE)
    : [];
  if (photos.length) cache.set(tag, { ts: now, photos });
  return photos;
}

/**
 * Safebooru：按 tag 取图，优先 sample 压缩图（约 850px / 200~400KB）。
 * 失败/无结果 → 返回空串。
 */
export async function safebooru(tag = "cosplay") {
  try {
    const photos = await fetchPhotos(tag);
    if (!photos.length) return "";
    const fresh = photos.filter(p => !recent.includes(p.id));
    const pool = fresh.length ? fresh : photos;
    const small = pool.filter(p => p.sample_url && p.sample_width > 0);
    const finalPool = small.length ? small : pool;
    const pick = finalPool[Math.floor(Math.random() * finalPool.length)];
    if (!pick) return "";
    recent.push(pick.id);
    if (recent.length > 40) recent.splice(0, recent.length - 40);
    const url = pick.sample_url || pick.file_url;
    const ext = (url.split(".").pop() || "jpg").split("?")[0];
    return url ? segment.image(url, `cos.${ext}`) : "";
  } catch {
    return "";
  }
}
