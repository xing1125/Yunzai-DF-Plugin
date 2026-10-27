import fs from "node:fs/promises";
import path from "node:path";
import { ResPath } from "../../dir.js";
import { request as requestUtil } from "../../utils/index.js";
import { pexels } from "./pexels.js";
import { safebooru } from "./safebooru.js";

const GALLERY_DIR = path.join(ResPath, "img", "gallery");
const IMG_RE = /\.(jpe?g|png|webp|gif)$/i;
const DOWNLOAD_TIMEOUT = 12000;

/** 本地图库：随机取 resources/img/gallery 下的一张图，目录为空则返回空串 */
export async function localGallery() {
  try {
    const files = (await fs.readdir(GALLERY_DIR)).filter(f => IMG_RE.test(f));
    if (!files.length) return "";
    const pick = files[Math.floor(Math.random() * files.length)];
    return segment.image(path.join(GALLERY_DIR, pick));
  } catch {
    return "";
  }
}

/** 自己下载图片为 Buffer（带超时），绕开适配器拉 URL 的慢路径 */
async function fetchBuffer(url, timeout = DOWNLOAD_TIMEOUT) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeout) });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

/** 多源随机：打乱顺序逐个尝试，第一个成功的即返回；全失败返回空串 */
async function pickSource(sources) {
  const order = [...sources].sort(() => Math.random() - 0.5);
  for (const fn of order) {
    const r = await fn();
    if (r) return r;
  }
  return "";
}

/** Pixiv（lolicon）：r18=0 + keyword，优先小图并自行下载，失败返回空串 */
async function pixiv(keyword) {
  try {
    const data = await requestUtil.get(
      `https://api.lolicon.app/setu/v2?r18=0&num=5&keyword=${encodeURIComponent(keyword)}`
    );
    const list = data?.data || [];
    if (!list.length) return "";
    const small = list.filter(d => d.width && d.width <= 1500);
    const pool = small.length ? small : list;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const url = pick?.urls?.original;
    if (!url) return "";
    const buf = await fetchBuffer(url);
    if (!buf) return "";
    const ext = (url.split(".").pop() || "png").split("?")[0];
    return segment.image(buf, `pixiv.${ext}`);
  } catch {
    return "";
  }
}

/** suyanw 真人 cos（原图源，作为混合候选） */
async function suyanwCos() {
  try {
    const data = await requestUtil.get("https://api.suyanw.cn/api/cos.php?type=json");
    const url = data?.text?.replace(/\\/g, "/");
    return url ? segment.image(url, "cos.jpg") : "";
  } catch {
    return "";
  }
}

/** suyanw 真人腿（原图源，作为混合候选） */
async function suyanwMeitui() {
  try {
    const data = await requestUtil.get("https://api.suyanw.cn/api/meitui.php?type=json");
    const url = data?.text?.replace(/\\/g, "/");
    return url ? segment.image(url, "meitui.jpg") : "";
  } catch {
    return "";
  }
}

export const apiHandlers = [
  {
    name: "jk",
    reg: "jk(?:制服)?",
    fnc: () => segment.image("https://api.suyanw.cn/api/jk.php", "jk.jpg")
  },
  {
    name: "黑丝",
    reg: "黑丝",
    fnc: () => [
      "唉嗨害，黑丝来咯",
      segment.image("https://api.suyanw.cn/api/hs.php", "heisi.jpg")
    ]
  },
  {
    name: "白丝",
    reg: "白丝",
    fnc: () => [
      "白丝来咯~",
      segment.image("https://api.yujn.cn/api/baisi.php", "baisi.jpg")
    ]
  },
  {
    name: "cos",
    reg: "cos",
    fnc: () => pickSource([
      () => safebooru("cosplay"),
      () => pixiv("cosplay"),
      () => suyanwCos()
    ])
  },
  {
    name: "看看腿",
    reg: "腿子?",
    fnc: async () => {
      const img = await pickSource([
        () => pixiv("thighhighs"),
        () => safebooru("thighhighs"),
        () => suyanwMeitui()
      ]);
      return img ? ["看吧涩批！", img] : "";
    }
  },
  {
    name: "写真",
    reg: "写真",
    fnc: () => pexels("写真")
  },
  {
    name: "街拍",
    reg: "街拍",
    fnc: () => pexels("街拍")
  },
  {
    name: "穿搭",
    reg: "穿搭",
    fnc: () => pexels("穿搭")
  },
  {
    name: "本地图库",
    reg: "本地|图库",
    fnc: () => localGallery()
  }
];
