import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { MediaService } from './media.service'
import { IResponse } from '@/types'

@Controller('/fb')
export class MediaController {
  constructor(private readonly appService: MediaService) {}

  @Get('/test')
  getHello(@Param('name') name: string): IResponse {
    console.log('get test name', name)
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
  postAddAdsMedia(@Body() names: string[]): IResponse {
    console.log('post names', names)
    return {
      error_msg: 'success',
      dm_error: 0,
      data: names
    }
  }
}
