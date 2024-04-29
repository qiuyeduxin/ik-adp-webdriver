import { Module } from '@nestjs/common'
import { AutoAuthController } from './autoAuth.controller'
import { AutoAuthService } from './autoAuth.service'

@Module({
  imports: [],
  controllers: [AutoAuthController],
  providers: [AutoAuthService]
})
export class FbAutoAuthModule {}
