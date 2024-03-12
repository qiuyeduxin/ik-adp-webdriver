import puppeteer, { Browser, LaunchOptions } from 'puppeteer-core'
import { sleep } from '../utils/index'
import { getPuppeteerOptions } from '../utils/browser'
import { CreateBrowserOptions } from '../types/browser'

const browserMap = new Map()

/**
 * 创建浏览器
 * @param data 创建浏览器的选项
 * @returns 返回一个Promise，包含创建的浏览器实例
 */
async function createBrowser(data: CreateBrowserOptions): Promise<Browser> {
  // 开启浏览器
  const launchOptions: LaunchOptions = await getPuppeteerOptions(data)

  const cacheData = browserMap.get(data.id)
  const browser: Browser = await (cacheData
    ? puppeteer.connect({
        ...launchOptions,
        browserWSEndpoint: cacheData?.browserWSEndpoint
      })
    : puppeteer.launch(launchOptions))
  const pages = await browser.pages()
  const page = pages[0]
  await page.setUserAgent(data.userAgent)
  // 校验代理
  if (data.proxyServer) {
    await page.authenticate({
      username: data.proxyUser + '',
      password: data.proxyPwd + ''
    })
  }

  browserMap.set(data.id, {
    browser,
    browserWSEndpoint: browser.wsEndpoint()
  })

  /**
   * 检查浏览器是否为空，如果为空则关闭浏览器
   */
  const checkAndCloseBrowser = async () => {
    const pages = await browser.pages()
    if (!pages.length) {
      await browser.close()
    }
  }

  browser.on('targetdestroyed', checkAndCloseBrowser)
  browser.on('disconnected', () => {
    browserMap.delete(data.id)
  })

  await sleep(1000)

  return browser
}

export default createBrowser
