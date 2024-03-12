import { Controller, Get, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import type { IResponse } from '@/types'

@Controller()
// @UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  getHello(): IResponse {
    return this.appService.getHello()
  }
}
