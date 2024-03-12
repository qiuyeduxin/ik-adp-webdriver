import { Injectable } from '@nestjs/common'
import createPage from '@/browser/createPage'
import { sleep } from '@/utils'
import * as urlApi from 'node:url'
import { IResponse } from '@/types'
import axios from 'axios'
import * as fs from 'node:fs'

@Injectable()
export class MediaService {
  getHello(): IResponse {
    return { data: 'It is ok', dm_error: 0, error_msg: 'success' }
  }

  async getAdsMedia(): Promise<IResponse<any>> {
    const options = {
      id: 132,
      name: 'test',
      proxyDomain:
        'https://data_chl:Q)o2EB=Tp~:GnHgq@adp-forward-txsg-in-proxy01.invsdata.com:9701',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }

    const checkCodeRes = await axios.get(
      'https://adp-busi.invsdata.com/chl/adp/api/account/v2/base_info/get_two_fa_code?dev_account_id=' +
        options.id
    )
    const fbLoginInfo = {
      account: '100065025516028',
      pwd: 'Zhongtai2023',
      checkCode: checkCodeRes?.data?.data
    }
    const { page: loginPage } = await createPage(options)

    loginPage.goto('https://business.facebook.com/business')

    const autoTimeMap = new Map() // 自动登录次数，防止重复触发

    const loginPromise = new Promise((resolve, reject) => {
      loginPage.on('load', async () => {
        const url = loginPage.url()
        if (url.includes('com/login/?') || url.includes('com/login.php?')) {
          // 登录页面
          if (autoTimeMap.get('login')) {
            // 已经自动登录过了，登录不上就不要再尝试了
            reject(
              new Error('登录错误, 已经自动登录过了，登录不上就不要再尝试了')
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
          if (autoTimeMap.get('checkpoint')) {
            // 已经自动登录过了，登录不上就不要再尝试了
            reject(
              new Error('登录错误, 已经自动登录过了，登录不上就不要再尝试了')
            )
            return
          }
          autoTimeMap.set('checkpoint', 1)
          const fbCheckCodeDom = await loginPage.$("input[id='approvals_code']") // email
          if (fbLoginInfo.checkCode) {
            await fbCheckCodeDom?.type(fbLoginInfo.checkCode)
            await loginPage.click("button[id='checkpointSubmitButton']")
          }
        } else if (url.includes('com/business')) {
          // 登录成功
          resolve(1)
        }
      })
    })

    await loginPromise

    const searchStr = 'The sound of shattering glass echoed from the bedroom'

    const { page, browser } = await createPage(options)
    loginPage.close()
    page.goto(
      `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=CN&q=${searchStr}&sort_data%5Bdirection%5D=desc&sort_data%5Bmode%5D=relevancy_monthly_grouped&search_type=keyword_unordered&media_type=all`
    )

    const getAdData = (q: string): Promise<any[]> => {
      return new Promise((resolve) => {
        const allData: any[] = []
        page.on('response', async (response) => {
          const originUrl = response.url()
          const urlData = urlApi.parse(originUrl, true)
          if (
            urlData.pathname?.includes('async/search_ads/') &&
            urlData?.query?.q === q &&
            urlData?.query?.count === '30'
          ) {
            const data = await response.text()
            const adData = JSON.parse(data.replace('for (;;);', ''))
            adData.payload.results.forEach((itemList: any[]) => {
              itemList.forEach((item: any) => {
                allData.push({
                  adArchiveID: item.adArchiveID,
                  categories: item.categories,
                  endDate: item.endDate,
                  startDate: item.startDate,
                  pageID: item.pageID,
                  pageName: item.pageName,
                  entityType: item.entityType,
                  isActive: item.isActive,
                  isProfilePage: item.isProfilePage,
                  publisherPlatform: item.publisherPlatform,
                  snapshot: {
                    ad_creative_id: item.snapshot.ad_creative_id,
                    page_profile_picture_url:
                      item.snapshot.page_profile_picture_url,
                    cta_type: item.snapshot.cta_type,
                    cta_text: item.snapshot.cta_text,
                    page_name: item.snapshot.page_name,
                    page_entity_type: item.snapshot.page_entity_type,
                    display_format: item.display_format
                  },
                  cards: item.snapshot?.cards?.map((card: any) => {
                    return {
                      body: card.body,
                      title: card.title,
                      video_preview_image_url: card.video_preview_image_url,
                      video_sd_url: card.video_sd_url,
                      video_hd_url: card.video_hd_url
                    }
                  }),
                  images: item.snapshot?.images?.map((card: any) => {
                    return {
                      original_image_url: card.original_image_url,
                      resized_image_url: card.resized_image_url
                    }
                  })
                })
              })
            })

            resolve(allData)
            // if (adData.payload.isResultComplete) {
            //   resolve(allData)
            // } else {
            //   await sleep(1000)
            //   page.evaluate(() => {
            //     window.scrollTo(0, document.body.scrollHeight)
            //   })
            // }
          }
        })
      })
    }

    const allData = await getAdData(searchStr)
    if (!fs.existsSync('temp')) {
      fs.mkdirSync('temp')
    }
    fs.writeFileSync(`temp/data-${Date.now()}.json`, JSON.stringify(allData))
    await sleep(1000)
    await browser.close()

    return {
      data: {
        total: allData.length,
        list: allData
      },
      dm_error: 0,
      error_msg: 'ok'
    }
  }
}
