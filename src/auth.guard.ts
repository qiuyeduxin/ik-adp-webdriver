import { Injectable } from '@nestjs/common'
import { CanActivate, ExecutionContext } from '@nestjs/common'

@Injectable()
class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 获取当前请求对象
    const request = context.switchToHttp().getRequest()

    // 从请求头部获取 token
    const authHeader = request.headers['authorization']

    if (!authHeader) {
      // 根据业务逻辑判断 token 是否有效

      return true // 通过验证
    } else {
      return false // 未提供 token 或无效
    }
  }
}

export default AuthGuard
