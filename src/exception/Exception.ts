import { HttpException, HttpStatus } from '@nestjs/common'
import { ApiCode } from './api.enum'

export class ApiException extends HttpException {
  private errorMessage: string
  private errorCode: ApiCode

  constructor(
    errorMessage: string,
    errorCode: ApiCode,
    statusCode: HttpStatus
  ) {
    super(errorMessage, statusCode)

    this.errorMessage = errorMessage
    this.errorCode = errorCode
  }

  getErrorCode(): ApiCode {
    return this.errorCode
  }

  getErrorMessage(): string {
    return this.errorMessage
  }
}
