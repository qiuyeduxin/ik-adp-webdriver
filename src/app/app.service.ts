import type { IResponse } from '@/types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  async getHello(): Promise<IResponse<unknown>> {
    return { dm_error: 0, data: 'Hello World!', error_msg: 'success' }
  }
}
