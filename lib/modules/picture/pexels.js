import config from "../../config/index.js";
import { request as requestUtil } from "../../utils/index.js";

const CACHE_TTL = 10 * 60 * 1000;
const PER_PAGE = 20;
const cache = new Map();
const recent = [];

// 分类 → Pexels 搜索词（英文检索更准）
const QUERIES = {
  写真: ["asian woman portrait", "japanese woman portrait", "asian girl aesthetic"],
  街拍: ["japanese street fashion", "tokyo street style", "asian street fashion"],
  穿搭: ["asian fashion outfit", "japanese outfit style", "asian girl fashion"],
  腿: ["legs fashion", "stockings outfit", "asian legs style"],
  cos: ["cosplay", "cosplay portrait", "cosplay costume"]
};

function apiKey() {
  return process.env.PEXELS_API_KEY || config?.Picture?.pexelsKey || "";
}

async function search(query) {
  const now = Date.now();
  const hit = cache.get(query);
  if (hit && now - hit.ts < CACHE_TTL) return hit.photos;

  const data = await requestUtil.get(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${PER_PAGE}&orientation=portrait`,
    "json",
    { headers: { Authorization: apiKey() } }
  );
  const photos = data?.photos || [];
  if (photos.length) {
    cache.set(query, { ts: now, photos });
    if (cache.size > 60) cache.delete(cache.keys().next().value);
  }
  return photos;
}

function pickUnique(photos) {
  const fresh = photos.filter(p => !recent.includes(p.id));
  const pool = fresh.length ? fresh : photos;
  const photo = pool[Math.floor(Math.random() * pool.length)];
  if (photo) {
    recent.push(photo.id);
    if (recent.length > 40) recent.splice(0, recent.length - 40);
  }
  return photo;
}

/**
 * Pexels 真人写真：按分类随机抽一张。
 * 无 key / 超时 / 配额耗尽 / 无结果 → 返回空串，由上层回退本地图库。
 */
export async function pexels(category = "写真") {
  if (!apiKey()) return "";
  const queries = QUERIES[category] || QUERIES.写真;
  const query = queries[Math.floor(Math.random() * queries.length)];
  try {
    const photos = await search(query);
    if (!photos.length) return "";
    const photo = pickUnique(photos);
    const url = photo?.src?.large2x || photo?.src?.original || photo?.src?.large;
    return url ? segment.image(url, "pexels.jpg") : "";
  } catch {
    return "";
  }
}
