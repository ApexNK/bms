// 本地配置信息
const appId = 'wx9a42b6525768c05b';
const urlName = 'capesonlee.tunnel.2bdata.com';
export const SiteURL = 'http://capesonlee.tunnel.2bdata.com/';
// const WECHAT_OPENID = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9a42b6525768c05b&redirect_uri=http%3a%2f%vidy.tunnel.2bdata.com%2fwechat%2fgrant&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
export const WECHAT_OPENID = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=http%3a%2f%2f${urlName}%2fwechat%2fgrant&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
export const LOGIN_WECHAT_OPENID = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=http%3a%2f%2f${urlName}%2fwechat%2fgrant&response_type=code&scope=snsapi_base&state=abc#wechat_redirect`;
// const WECHAT_OPENID = ' https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appId +'&redirect_uri=http%3a%2f%2f' + urlName + '%2fwechat%2fgrant&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
// const TitleName = 'TOEFL';
// export WECHAT_OPENID ;

// export  SiteURL;
