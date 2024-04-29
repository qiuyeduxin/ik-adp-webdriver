import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MediaModule } from '@/business/fb/adMedia/media.module'
import { configModule } from '@/config/config.module'
import { FbAutoAuthModule } from '@/business/fb/autoAuth/autoAuth.module'

@Module({
  imports: [configModule, MediaModule, FbAutoAuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
