import type { IResponse } from '@/types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): IResponse {
    return { dm_error: 0, data: 'Hello World!', error_msg: 'success' }
  }
}
