import { Body, Controller, Get, Ip, Param, Post, Query } from '@nestjs/common'
import { MediaService } from './media.service'
import { IResponse } from '@/types'

@Controller('/fb')
export class MediaController {
  constructor(private readonly appService: MediaService) {}

  @Get('/test')
  getHello(): IResponse {
    return this.appService.getHello()
  }

  @Get('/get_ads_media')
  async getFbAdsMedia(): Promise<IResponse> {
    try {
      const res = await this.appService.getAdsMedia()
      return res
    } catch (error) {
      return {
        error_msg: error.message,
        dm_error: 1,
        data: []
      }
    }
  }

  @Post('/post_add')
  postAddAdsMedia(@Body('names') names: string[]): IResponse {
    return {
      error_msg: 'success',
      dm_error: 0,
      data: names
    }
  }
}
