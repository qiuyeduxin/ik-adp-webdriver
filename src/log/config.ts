import envConfig from '@/config/env'

export default {
  appenders: {
    console: {
      // 记录器1:输出到控制台
      type: 'console'
    },
    access: {
      type: 'dateFile', //会写入文件，并且按照日期分类
      filename: `${envConfig.logPath}/access`, //日志文件名，会命名为：access.当前时间.log
      alwaysIncludePattern: true,
      pattern: 'yyyyMMdd', //时间格式
      numToKeep: 60,
      numBackups: 3,
      category: 'http'
    },
    app: {
      // ：记录器3：输出到日期文件
      type: 'dateFile',
      filename: `${envConfig.logPath}/app`,
      alwaysIncludePattern: true,
      numToKeep: 7,
      pattern: 'yyyy-MM-dd.log',
      encoding: 'utf-8'
    },
    errorFile: {
      // ：记录器4：输出到error log
      type: 'dateFile',
      filename: `${envConfig.logPath}/error`,
      alwaysIncludePattern: true,
      numToKeep: 7,
      pattern: 'yyyy-MM-dd.log',
      encoding: 'utf-8'
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile'
    }
  },
  categories: {
    default: {
      appenders: ['app', 'errors', 'console'],
      level: 'DEBUG'
    }, // 默认log类型，输出到控制台 log文件 log日期文件 且登记大于info即可
    info: { appenders: ['console', 'app', 'errors'], level: 'info' },
    access: { appenders: ['console', 'app', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'DEBUG' }
  },
  pm2: true, //使用pm2来管理项目时打开
  pm2InstanceVar: 'INSTANCE_ID' // 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
}
