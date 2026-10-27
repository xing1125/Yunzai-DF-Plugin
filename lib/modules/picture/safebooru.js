import { request as requestUtil } from "../../utils/index.js";

const API = "https://safebooru.org/index.php?page=dapi&s=post&q=index&tags=cosplay&limit=60&json=1";
const MIN_SIZE = 1000;
const CACHE_TTL = 10 * 60 * 1000;
const cache = { ts: 0, photos: [] };
const recent = [];

async function fetchPhotos() {
  const now = Date.now();
  if (cache.photos.length && now - cache.ts < CACHE_TTL) return cache.photos;
  const list = await requestUtil.get(API, "json", {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const photos = Array.isArray(list)
    ? list.filter(p => p.width >= MIN_SIZE && p.height >= MIN_SIZE)
    : [];
  if (photos.length) {
    cache.ts = now;
    cache.photos = photos;
  }
  return photos;
}

/**
 * Safebooru 真人 Cosplay：cosplay tag + 分辨率过滤，优先取 sample 压缩图（约 850px / 200~400KB）。
 * 失败/无结果 → 返回空串，由上层回退本地图库。
 */
export async function safebooru() {
  try {
    const photos = await fetchPhotos();
    if (!photos.length) return "";
    const fresh = photos.filter(p => !recent.includes(p.id));
    const pool = fresh.length ? fresh : photos;
    // 优先有 sample 的，避免原图几 MB 拖慢发送
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
