import { Body, Controller, Post } from '@nestjs/common'
import { AutoAuthService } from './autoAuth.service'
import { Logger } from '@/log'

@Controller('/fb')
export class AutoAuthController {
  constructor(private readonly autoAuthService: AutoAuthService) {}

  @Post('/auto_auth')
  execAuth(
    @Body('auth_url') authUrl: string,
    @Body('dev_account') devAccount: Record<string, any>,
    @Body('fingerprint_browser') browserInfo: Record<string, any>
  ) {
    return this.autoAuthService.execAuth(authUrl, devAccount, browserInfo)
  }
}
