import * as Path from 'path'
import * as Log4js from 'log4js'
import * as Util from 'util'
import * as StackTrace from 'stacktrace-js'
import chalk from 'chalk'
import config from './config'
import { getFormatDate } from '@/utils'

//日志级别
export enum LoggerLevel {
  ALL = 'ALL',
  MARK = 'MARK',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF'
}

// 内容跟踪类
export class ContextTrace {
  constructor(
    public readonly context: string,
    public readonly path?: string,
    public readonly lineNumber?: number,
    public readonly columnNumber?: number
  ) {}
}

Log4js.addLayout('Awesome-nest', (logConfig: any) => {
  return (logEvent: Log4js.LoggingEvent): string => {
    let moduleName: string = ''
    let position: string = ''

    //日志组装
    const messageList: string[] = []
    logEvent.data.forEach((value: any) => {
      if (value instanceof ContextTrace) {
        moduleName = value.context
        //显示触发日志的坐标（行/列）
        if (value.lineNumber && value.columnNumber) {
          position = `${value.lineNumber},${value.columnNumber}`
        }
        return
      }
      if (typeof value !== 'string') {
        value = Util.inspect(value, false, 3, true)
      }
      messageList.push(value)
    })
    //日志组成部分
    const messageOutput: string = messageList.join(' ')
    const positionOutput: string = position ? `[${position}]` : ''
    const typeOutput: string = `[${logConfig.type}]${logEvent.pid.toString()} - `
    const dateOutput: string = getFormatDate(new Date(logEvent.startTime))
    const moduleOutput: string = moduleName
      ? `[${moduleName}]`
      : '[LoggerService]'
    let levelOutput: string = `[${logEvent.level}]${messageOutput}`
    //根据日志级别，用不同颜色区分
    switch (logEvent.level.toString()) {
      case LoggerLevel.DEBUG:
        levelOutput = chalk.green(levelOutput)
        break

      case LoggerLevel.INFO:
        levelOutput = chalk.cyan(levelOutput)
        break

      case LoggerLevel.WARN:
        levelOutput = chalk.yellow(levelOutput)
        break

      case LoggerLevel.ERROR:
        levelOutput = chalk.red(levelOutput)
        break

      case LoggerLevel.FATAL:
        levelOutput = chalk.hex('#DD4C35')(levelOutput)
        break

      default:
        levelOutput = chalk.grey(levelOutput)
        break
    }
    return `${chalk.green(typeOutput)} ${dateOutput} ${chalk.yellow(moduleOutput)}`
  }
})

// 注入配置
Log4js.configure(config)

//实例化
const Log4logger = Log4js.getLogger()
Log4logger.level = LoggerLevel.TRACE

export const Logger = {
  trace(...args: any[]) {
    Log4logger.trace(Logger.getStackTrace(), ...args)
  },
  debug(...args: any[]) {
    Log4logger.debug(Logger.getStackTrace(), ...args)
  },

  log(...args: any[]) {
    Log4logger.info(Logger.getStackTrace(), ...args)
  },

  info(...args: any[]) {
    Log4logger.info(Logger.getStackTrace(), ...args)
  },

  warn(...args: any[]) {
    Log4logger.warn(Logger.getStackTrace(), ...args)
  },

  warning(...args: any[]) {
    Log4logger.warn(Logger.getStackTrace(), ...args)
  },

  error(...args: any[]) {
    Log4logger.error(Logger.getStackTrace(), ...args)
  },

  fatal(...args: any[]) {
    Log4logger.fatal(Logger.getStackTrace(), ...args)
  },

  access(...args: any[]) {
    const loggerCustom = Log4js.getLogger('http')
    loggerCustom.info(Logger.getStackTrace(), ...args)
  },

  // 日志追踪，可以追溯到哪个文件、第几行第几列
  getStackTrace(deep: number = 2): string {
    const stackList: StackTrace.StackFrame[] = StackTrace.getSync()
    const stackInfo: StackTrace.StackFrame = stackList[deep]

    const lineNumber: number = stackInfo.lineNumber
    const columnNumber: number = stackInfo.columnNumber
    const fileName: string = stackInfo.fileName
    const basename: string = Path.basename(fileName)
    return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`
  }
}
