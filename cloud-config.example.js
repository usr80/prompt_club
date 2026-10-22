/* =========================================================
   云服务配置模板
   1) 复制本文件为 cloud-config.js
   2) 填入你自己的值（在 WorkBuddy 云服务开通后获得）
   cloud-config.js 已被 .gitignore 忽略，不会进入版本库。
   ========================================================= */
window.CLOUD_CONFIG = {
  // 应用 ID，形如 wbapp_xxxxxxxxxxxxxxxx
  applicationId: 'wbapp_xxxxxxxxxxxxxxxxxxxxxx',

  // 云服务接入地址，形如 https://<你的应用>.app.workbuddy.link
  // 注意：部署到真实站点后 app.js 会让 endpoint 自动跟随 location.origin，
  //       这里只需填一个可用的地址（本地调试时作为回退）。
  endpoint: 'https://your-app.app.workbuddy.link',

  // 如需强制固定 endpoint（不跟随站点域名），取消下面这行注释
  // endpointPin: true,

  // 登录授权中转地址（一般无需修改）
  oauthRelayBaseUrl: 'https://www.workbuddy.cn/v2/as/genie-baas/oauth',

  // 前端可公开的发布密钥，形如 wbpk_xxxxxxxx
  publishableKey: 'wbpk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',

  // 表名
  table: 'prompt_items',      // 私有提示词表
  shareTable: 'shared_prompts' // 共享只读快照表
};
