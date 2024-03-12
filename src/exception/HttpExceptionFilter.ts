import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import type { IResponse } from '@/types'
import { ApiException } from './Exception'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const status = exception.getStatus()
    const errRes: IResponse = {
      dm_error: status,
      error_msg: exception?.response?.message
    }

    if (exception instanceof ApiException) {
      errRes.dm_error = exception.getErrorCode()
      errRes.error_msg = exception.getErrorMessage()
      response.status(status).json(errRes)
    } else {
      response.status(status).json(errRes)
    }
  }
}
