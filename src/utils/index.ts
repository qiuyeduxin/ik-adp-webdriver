import type { Fun, IObject } from '@/types'
import { exec } from 'node:child_process'

// 休眠
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 等待某一个dom元素出现
function waitElNoTimeout(page: any, exp: string, cb: () => void) {
  page
    .$(exp)
    .then(cb)
    .catch(async () => {
      await sleep(1000)
      waitElNoTimeout(page, exp, cb)
    })
}

function format10(input: number): string {
  return `${input > 9 ? '' : '0'}${input}`
}

// 格式化当前时间
function getCurTime(): string {
  const d1 = new Date()
  const year = d1.getFullYear()
  const month = d1.getMonth() + 1
  const day = d1.getDay()
  const hour = d1.getHours()
  const minute = d1.getMinutes()
  const second = d1.getSeconds()
  return `${format10(year)}-${format10(month)}-${format10(day)} ${format10(
    hour
  )}:${format10(minute)}:${format10(second)}`
}

// 格式化时间
function getFormatDate(d1: Date): string {
  const year = d1.getFullYear()
  const month = d1.getMonth() + 1
  const day = d1.getDay()
  const hour = d1.getHours()
  const minute = d1.getMinutes()
  const second = d1.getSeconds()
  return `${format10(year)}-${format10(month)}-${format10(day)} ${format10(
    hour
  )}:${format10(minute)}:${format10(second)}`
}

function execMd(md: string): Promise<number> {
  return new Promise((resolve, reject) => {
    exec(md, (error: any) => {
      if (error) {
        reject(error)
        return
      }
      resolve(1)
    })
  })
}

function noop() {}

const stringifyParams = (
  params: IObject<string, string | number | boolean>,
  cb?: Fun
): string => {
  return Object.keys(params)
    .map((name) => {
      const val = params[name]
      const res = typeof cb === 'function' ? cb(val, name) : val
      return `${name}=${res}`
    })
    .join('&')
}

const getUrlParams = (url: string): IObject<string, any> => {
  const urlParams: Record<string, string> = {}

  if (!url.includes('?')) {
    return urlParams
  }

  // 防止hash值, 影响参数名称
  const search: string = url.replace(/.*\?/, '')

  // 如果没有, 则返回空对象
  if (search) {
    const searchArr: Array<string> = decodeURIComponent(search).split('&')
    searchArr.forEach((str) => {
      const [key, value] = str.split('=')
      // 如果已经有该参数就不添加进去了
      if (key && !urlParams[key]) {
        urlParams[key] = value
      }
    })
  }

  return urlParams
}

export {
  sleep,
  waitElNoTimeout,
  getCurTime,
  execMd,
  noop,
  getFormatDate,
  stringifyParams,
  getUrlParams
}
