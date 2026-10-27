import fs from "node:fs/promises";
import path from "node:path";
import { ResPath } from "../../dir.js";
import { pexels } from "./pexels.js";

const GALLERY_DIR = path.join(ResPath, "img", "gallery");
const IMG_RE = /\.(jpe?g|png|webp|gif)$/i;

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
    fnc: () => pexels("cos")
  },
  {
    name: "看看腿",
    reg: "腿子?",
    fnc: () => pexels("腿")
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
