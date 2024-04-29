import { CreateBrowserOptions } from '../types/browser'
import { LaunchOptions } from 'puppeteer-core'
import envConfig from '@/config/env'

const devBrowserPath =
  '/Users/ywen/Library/Caches/ikAdp/chromium/mac_arm-1264446/chrome-mac/Chromium.app/Contents/MacOS/Chromium'
// const devBrowserPath =
//   '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
/**
 * 获取浏览器路径
 * @returns {string} 浏览器路径
 */
function getBrowserPath(): string {
  return envConfig.isDev
    ? devBrowserPath
    : process.env.PUPPETEER_EXECUTABLE_PATH
}

/**
 * 将代理服务器的配置转换为浏览器的配置
 * @param data 浏览器的配置
 * @returns 转换后的浏览器配置
 */
function transformProxyServer(
  data: CreateBrowserOptions
): CreateBrowserOptions {
  const newData = { ...data } // 创建一个新的对象，用于存储转换后的配置
  if (newData.proxyDomain) {
    // 如果配置中存在代理域名
    // 从url中截取密码账号和代理域名
    newData.proxyServer = newData.proxyDomain.replace(/(?=\/\/).*@/, (word) => {
      const str = word.replace(/\/\/|@/g, '') // 去除url中的协议和符号
      newData.proxyUser = str.replace(/:.*/, '') // 获取用户名
      newData.proxyPwd = str.replace(newData.proxyUser, '').replace(':', '') // 获取密码
      return '//'
    })
  }
  return newData // 返回转换后的配置
}

// 获取启动浏览器参数
async function getPuppeteerOptions(
  data: CreateBrowserOptions
): Promise<LaunchOptions> {
  const options = {
    args: [
      '--no-first-run',
      '--no-sandbox',
      '--disable-extensions',
      '--disable-infobars',
      '--disable-automation',
      '--no-default-browser-check',
      '--disable-device-orientation',
      '--disable-metrics-reporting',
      '--disable-logging'
    ],
    headless: false,
    defaultViewport: null,
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: [
      '--enable-infobars',
      '--enable-features=NetworkService,NetworkServiceInProcess',
      '--enable-automation',
      'about:blank'
    ],
    executablePath: getBrowserPath(),
    userDataDir: `./webCache/${data.id}`
  }

  if (data.proxyServer) {
    options.args.push(`--proxy-server=${data.proxyServer}`)
  }

  if (data.userAgent) {
    options.args.push(`--user-agent="${data.userAgent}"`)
  }

  return options
}

export { getPuppeteerOptions, getBrowserPath, transformProxyServer }
