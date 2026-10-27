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
    group: "功能类",
    list: [
      { icon: 4, title: "拾取关键词原神", desc: "本来聊得好好的，突然有人聊起了原神，搞得大家都不高兴" }
    ]
  },
  {
    group: "Git仓库推送 （使用锅巴进行配置）",
    list: [
      { icon: 6, title: "#检查仓库更新", desc: "检查是否有仓库更新并推送至对应群或人（定时检查同逻辑）" },
      { icon: 9, title: "#推送仓库更新", desc: "获取所有仓库的最新数据并回复到当前对话（不推送群或人）" }
    ]
  },
  {
    group: "随机图片类",
    list: [
      { icon: 35, title: "#来张jk", desc: "随机jk图片" },
      { icon: 5, title: "#来张黑丝/白丝", desc: "顾名思义" },
      { icon: 3, title: "#来张cos", desc: "随机cos图片" },
      { icon: 8, title: "#看看腿", desc: "kkt" }
    ]
  },
  {
    group: "主人功能",
    auth: "master",
    list: [
      { icon: 12, title: "#DF(强制)?更新", desc: "拉取Git更新" },
      { icon: 17, title: "#DF清理无效数据", desc: "清理本插件占用的数据库内存" },
      { icon: 14, title: "#DF版本", desc: "查看近期版本内容" }
    ]
  }
];
