import { update } from "../../../other/update.js";
import { PluginName } from "../dir.js";

export class DFUpdate extends plugin {
  constructor() {
    super({
      name: "DF:更新插件",
      event: "message",
      priority: 1000,
      rule: [{ reg: /^#DF(插件)?(强制)?更新(日志)?$/i, fnc: "update" }]
    });
  }

  async update(e = this.e) {
    const isLog = e.msg.includes("日志");
    e.msg = (isLog ? "#更新日志" : e.msg.includes("强制") ? "#强制更新" : "#更新") + PluginName;

    const updater = new update();
    updater.e = e;
    return isLog ? updater.updateLog() : updater.update();
  }
}
