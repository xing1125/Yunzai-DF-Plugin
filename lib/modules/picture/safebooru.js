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
 * Safebooru 真人 Cosplay：cosplay tag + 分辨率过滤，随机抽一张。
 * 失败/无结果 → 返回空串，由上层回退本地图库。
 */
export async function safebooru() {
  try {
    const photos = await fetchPhotos();
    if (!photos.length) return "";
    const fresh = photos.filter(p => !recent.includes(p.id));
    const pool = fresh.length ? fresh : photos;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) {
      recent.push(pick.id);
      if (recent.length > 40) recent.splice(0, recent.length - 40);
    }
    return pick?.file_url ? segment.image(pick.file_url, "cos.jpg") : "";
  } catch {
    return "";
  }
}
