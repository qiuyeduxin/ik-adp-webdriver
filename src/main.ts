import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import configuration from './config/configuration'
import { HttpExceptionFilter } from './exception/HttpExceptionFilter'
import { Logger, loggerMiddleware, TransformInterceptor } from '@/log'

const config = configuration()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: Logger })

  // 监听所有的请求路由，并打印日志
  app.use(loggerMiddleware)
  // 使用全局拦截器打印出参
  app.useGlobalInterceptors(new TransformInterceptor())

  app.useGlobalFilters(new HttpExceptionFilter())
  app.setGlobalPrefix('api')

  await app.listen(config.http.port)
}
bootstrap()
