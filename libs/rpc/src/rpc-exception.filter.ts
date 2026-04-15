import {ArgumentsHost, Catch, HttpException} from '@nestjs/common'
import {BaseRpcExceptionFilter, RpcException} from '@nestjs/microservices'
import {Observable} from 'rxjs'
import {mapHttpStatusToRpcCode} from './rpc-http-code.mapper'
import {RpcError} from './rpc.type'

@Catch(RpcException, HttpException)
export class RpcExceptionFilter extends BaseRpcExceptionFilter<
  RpcException | HttpException,
  RpcError
> {
  override catch(
    exception: RpcException | HttpException,
    host: ArgumentsHost
  ): Observable<RpcError> {
    if (exception instanceof HttpException) {
      return super.catch(new RpcException(this.toRpcError(exception)), host)
    }

    return super.catch(exception, host)
  }

  private toRpcError(exception: HttpException): RpcError {
    const status = exception.getStatus()
    const response = exception.getResponse()

    if (typeof response === 'string') {
      return {
        code: mapHttpStatusToRpcCode(status),
        message: response,
      }
    }

    if (this.isRecord(response)) {
      const {message, ...details} = response

      return {
        code: mapHttpStatusToRpcCode(status),
        message: this.resolveMessage(message, exception.message),
        details: Object.keys(details).length > 0 ? details : undefined,
      }
    }

    return {
      code: mapHttpStatusToRpcCode(status),
      message: exception.message,
    }
  }

  private resolveMessage(message: unknown, fallback: string): string {
    if (typeof message === 'string') {
      return message
    }

    if (Array.isArray(message)) {
      return message.join(', ')
    }

    return fallback
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }
}
