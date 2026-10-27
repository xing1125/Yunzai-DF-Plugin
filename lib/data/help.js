export const helpCfg = {
  title: "DF帮助",
  subTitle: "[DF插件] Yunzai-Bot & DF-Plugin",
  colCount: 4,
  colWidth: 300,
  style: {
    fontColor: "#3fe4e4ff",
    descColor: "#ffffff",
    contBgColor: "rgba(6, 21, 31, 0)",
    contBgBlur: 1.9,
    headerBgColor: "rgba(172, 229, 209, .4)",
    rowBgColor1: "rgba(6, 21, 31, .1)",
    rowBgColor2: "rgba(6, 21, 31, .1)",
    fontShadow: "-1px 0 black,0 1px black,1px 0 black,0 -1px black"
  }
};

export const helpList = [
  {
    group: "随机图片",
    list: [
      { icon: 35, title: "#来张jk", desc: "随机 JK 制服图" },
      { icon: 5, title: "#来张黑丝 / 白丝", desc: "黑丝、白丝随机图" },
      { icon: 3, title: "#来张cos", desc: "真人 Cosplay 摄影" },
      { icon: 8, title: "#看看腿", desc: "二次元美腿图" },
      { icon: 21, title: "#来张写真 / 街拍 / 穿搭", desc: "真人写真（需配置 Pexels Key）" },
      { icon: 22, title: "#来张本地", desc: "本地图库随机图" }
    ]
  },
  {
    group: "群聊彩蛋",
    list: [
      { icon: 4, title: "群聊出现「原神」", desc: "自动发一张梗图，每群仅一次（需开启 other.ys）" }
    ]
  },
  {
    group: "Git 仓库更新推送",
    list: [
      { icon: 6, title: "#检查仓库更新", desc: "检查仓库更新并按配置推送（定时任务同逻辑）" },
      { icon: 9, title: "#推送仓库更新", desc: "获取所有仓库最新数据，仅回复当前对话" }
    ]
  },
  {
    group: "主人功能",
    auth: "master",
    list: [
      { icon: 12, title: "#DF更新 / #DF强制更新", desc: "拉取插件 Git 更新" },
      { icon: 17, title: "#DF清理无效数据", desc: "清理插件占用的 Redis 无效 key" },
      { icon: 14, title: "#DF版本", desc: "查看近期版本内容" }
    ]
  }
];
