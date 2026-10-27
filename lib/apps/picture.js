import config from "../config/index.js";
import { apiHandlers } from "../modules/index.js";

const apiRegs = apiHandlers.map(item => `(?:${item.reg instanceof RegExp ? item.reg.source : item.reg})$`);
const apiReg = new RegExp(`^#?(?:来张|看看|随机)(${apiRegs.join("|")})`, "i");

export class RandomPictures extends plugin {
  constructor() {
    super({
      name: "DF:随机图片",
      dsc: "随机图片小功能",
      event: "message",
      priority: 500,
      rule: [{ reg: apiReg, fnc: "apiPicture" }]
    });
  }

  async apiPicture(e = this.e) {
    if (!config.Picture.open || !config.Picture.apiPicture) {
      logger.mark("随机api图片已禁用");
      return false;
    }

    const key = apiReg.exec(e.msg)?.[1]?.toLowerCase();
    if (!key) return false;

    const { fnc, name } = apiHandlers.find(item =>
      (item.reg instanceof RegExp ? item.reg : new RegExp(item.reg, "i")).test(key)
    ) ?? {};
    if (!fnc) return false;

    if (name && config.Picture.apiDisable.includes(name)) {
      logger.mark(`随机图片 ${name} 已被禁用`);
      return false;
    }

    const result = await fnc();
    if (!result) return false;

    await e.reply(result, true);
    return true;
  }
}
