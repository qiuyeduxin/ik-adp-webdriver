import { CreateBrowserOptions } from '../types/browser'
import createBrowser from './createBrowser'
import { Browser } from 'puppeteer-core'
import { transformProxyServer } from '../utils/browser'

async function createPage(options: CreateBrowserOptions) {
  const browser: Browser = await createBrowser(transformProxyServer(options))

  const pages = await browser.pages()
  const firstUrl = pages[0].url()
  const page = firstUrl.includes('chrome://new-tab-page')
    ? pages[0]
    : await browser.newPage()
  return {
    page,
    browser
  }
}

export default createPage
