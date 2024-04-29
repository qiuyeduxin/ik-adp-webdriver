export enum ApiCode {
  TIMEOUT = -1, // 系统繁忙
  SUCCESS = 0, // 成功
  ERR_NETWORK = 10002, // 调用接口超时
  ERR_CONNECT_THRID_TIMEOUT = 10003, // 调用第三方接口超时

  USER_ID_INVALID = 10001, // 用户id无效

  FB_AUTO_AUTH_ERROR = 10100 // facebook autoauth error
}
