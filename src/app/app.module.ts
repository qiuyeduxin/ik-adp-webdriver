import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MediaModule } from '@/business/fb/adMedia/media.module'
import { configModule } from '@/config/config.module'

@Module({
  imports: [configModule, MediaModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
