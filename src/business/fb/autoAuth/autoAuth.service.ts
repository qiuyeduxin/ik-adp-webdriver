import createPage from '@/browser/createPage'
import { ApiException } from '@/exception/Exception'
import { ApiCode } from '@/exception/api.enum'
import type { IResponse } from '@/types'
import { sleep } from '@/utils'
import { Injectable } from '@nestjs/common'
import axios from 'axios'
import type { Browser } from 'puppeteer-core'

@Injectable()
export class AutoAuthService {
  async execAuth(
    authUrl: string,
    devAccount: Record<string, any>,
    browserInfo: Record<string, any>
  ): Promise<IResponse<any>> {
    const options = {
      id: browserInfo.dev_account_id,
      name: browserInfo.name,
      proxyDomain: browserInfo.proxy_domain,
      userAgent: browserInfo.user_agent
    }
    let curBrowser: Browser = null

    try {
      const checkCodeRes = await axios.get(
        'http://testadp-busi.athh.cc/chl/adp/api/account/v2/base_info/get_two_fa_code?dev_account_id=' +
          options.id
      )
      const fbLoginInfo = {
        account: devAccount.media_user_id || devAccount.account_name,
        pwd: devAccount.account_password,
        checkCode: checkCodeRes?.data?.data
      }
      const { page: loginPage } = await createPage(options)

      loginPage.goto('https://business.facebook.com/business')

      const autoTimeMap = new Map() // 自动登录次数，防止重复触发

      const loginPromise = new Promise((resolve, reject) => {
        loginPage.on('load', async () => {
          const loadTime = +autoTimeMap.get('load')
          autoTimeMap.set('load', loadTime + 1)
          if (!loadTime) {
            await sleep(2000)
          }
          const url = loginPage.url()
          if (url.includes('com/login/?') || url.includes('com/login.php?')) {
            // 登录页面
            if (autoTimeMap.get('login')) {
              // 已经自动登录过了，登录不上就不要再尝试了
              reject(
                new Error(
                  '登录错误, login, 已经自动登录过了，登录不上就不要再尝试了'
                )
              )
              return
            }
            autoTimeMap.set('login', 1)
            const emailDom = await loginPage.$("input[id='email']") // email
            const pwdDom = await loginPage.$("input[id='pass']") //pwd
            if (!emailDom || !pwdDom) {
              // 发生了登录错误
              reject(new Error('登录错误, !emailDom || !pwdDom'))
              return
            }
            await emailDom.type(fbLoginInfo.account)
            if (fbLoginInfo.pwd) {
              await pwdDom.type(fbLoginInfo.pwd)
              await loginPage.click("button[id='loginbutton']")
            }
          } else if (url.includes('com/checkpoint')) {
            const tryNum = +autoTimeMap.get('checkpoint')
            if (tryNum > 1) {
              // 已经自动登录过了，登录不上就不要再尝试了
              reject(
                new Error(
                  '登录错误, checkpoint, 已经自动登录过了，登录不上就不要再尝试了'
                )
              )
              return
            }
            const btnDom = await loginPage.$(
              "button[id='checkpointSubmitButton']"
            )
            if (!btnDom) {
              const innerHtml = await loginPage.evaluate(
                () => document.body.innerHTML
              )
              if (innerHtml.includes('has been locked')) {
                reject(new Error('账号被锁定'))
              } else {
                reject(new Error('登录错误, checkpoint, 找不到提交按钮'))
              }
              return
            }
            autoTimeMap.set('checkpoint', tryNum + 1)
            const fbCheckCodeDom = await loginPage.$(
              "input[id='approvals_code']"
            ) // email
            if (!fbCheckCodeDom && btnDom) {
              await loginPage.click("button[id='checkpointSubmitButton']")
              return
            }
            if (fbLoginInfo.checkCode) {
              await fbCheckCodeDom?.type(fbLoginInfo.checkCode)
              await loginPage.click("button[id='checkpointSubmitButton']")
            }
          } else if (url.includes('com/business')) {
            // 登录成功
            resolve(1)
          } else {
            const innerHtml = await loginPage.evaluate(
              () => document.body.innerHTML
            )
            if (innerHtml.includes('update your password')) {
              reject(new Error('登录账户失败, 请更新你的密码'))
            } else {
              reject(new Error('登录账户失败'))
            }
          }
        })
      })

      await loginPromise
      const { page, browser } = await createPage(options)
      curBrowser = browser
      await loginPage.close()
      page.goto(authUrl)

      const pagePromise = new Promise((resolve, reject) => {
        page.on('load', async () => {
          const url = page.url()
          if (url.includes('com/privacy/consent/gdp')) {
            // 处理 以xxx的身份继续
            const btnDom = await page.$("div[role='button']")
            if (!btnDom) {
              reject(new Error('授权失败, 获取不到 以xxx的身份继续 按钮'))
              return
            }
            await page.click("div[role='button']")
          } else if (
            url.replace(/\?.*/, '').includes('https://adp-busi.invsdata.com')
          ) {
            resolve(1)
          } else if (
            !url
              .replace(/\?.*/, '')
              .includes('https://www.facebook.com/v12.0/dialog/oauth')
          ) {
            reject(new Error('授权失败'))
          }
        })
      })
      await pagePromise
    } catch (err) {
      throw new ApiException(err.message, ApiCode.FB_AUTO_AUTH_ERROR, 500)
    }
    if (curBrowser) {
      curBrowser.close()
    }

    return {
      data: 'success',
      dm_error: 0,
      error_msg: 'ok'
    }
  }
}
