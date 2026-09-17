import { request as requestUtil } from "../../utils/index.js";

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
    fnc: async () => {
      const data = await requestUtil.get("https://api.suyanw.cn/api/cos.php?type=json");
      if (data) {
        return ["cos来咯~", segment.image(data.text.replace(/\\/g, "/"), "cos.jpg")];
      }
      return "";
    }
  },
  {
    name: "看看腿",
    reg: "腿子?",
    fnc: async () => {
      const data = await requestUtil.get("https://api.suyanw.cn/api/meitui.php?type=json");
      if (data) {
        return ["看吧涩批！", segment.image(data.text.replace(/\\/g, "/"), "meitui.jpg")];
      }
      return "";
    }
  }
];
