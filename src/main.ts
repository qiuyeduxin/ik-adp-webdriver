import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import configuration from './config/configuration'
import { HttpExceptionFilter } from './exception/HttpExceptionFilter'
import { Logger, loggerMiddleware, TransformInterceptor } from '@/log'
import { VersioningType } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

Logger.info('process.env.NODE_ENV => ', process.env.NODE_ENV)
const config = configuration()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: Logger })

  app.setGlobalPrefix('chl/adp/api/webdriver')
  // 监听所有的请求路由，并打印日志
  app.use(loggerMiddleware)
  // 使用全局拦截器打印出参
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.enableVersioning({
    type: VersioningType.URI
  })
  app.use(cookieParser())

  await app.listen(config.http.port)
}
bootstrap()
