import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import {Response} from 'express'
import {isRpcError, toRpcError} from './rpc-error.mapper'
import {mapRpcCodeToHttpStatus} from '../rpc-http-code.mapper'

@Catch()
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse())
      return
    }

    if (isRpcError(exception)) {
      response.status(mapRpcCodeToHttpStatus(exception.code)).json(exception)
      return
    }

    const rpcError = toRpcError(exception)
    response.status(mapRpcCodeToHttpStatus(rpcError.code)).json(rpcError)
  }
}
