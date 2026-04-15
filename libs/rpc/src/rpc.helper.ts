import {RpcException} from '@nestjs/microservices'
import {RpcError} from './rpc.type'

export function rpcInvalidArgument(
  message: string = 'Invalid argument',
  details?: Record<string, unknown>
): never {
  const payload: RpcError = {
    code: 'INVALID_ARGUMENT',
    message,
    details,
  }
  throw new RpcException(payload)
}

export function rpcBadRequest(
  message: string = 'Bad Request',
  details?: Record<string, unknown>
): never {
  return rpcInvalidArgument(message, details)
}

export function rpcNotFound(
  message: string = 'Not Found',
  details?: Record<string, unknown>
): never {
  const payload: RpcError = {
    code: 'NOT_FOUND',
    message,
    details,
  }
  throw new RpcException(payload)
}

export function rpcInternalServerError(
  message: string = 'Internal error',
  details?: Record<string, unknown>
): never {
  const payload: RpcError = {
    code: 'INTERNAL',
    message,
    details,
  }
  throw new RpcException(payload)
}

export function rpcUnauthorized(
  message: string = 'Unauthorized',
  details?: Record<string, unknown>
): never {
  return rpcUnauthenticated(message, details)
}

export function rpcUnauthenticated(
  message: string = 'Unauthenticated',
  details?: Record<string, unknown>
): never {
  const payload: RpcError = {
    code: 'UNAUTHENTICATED',
    message,
    details,
  }
  throw new RpcException(payload)
}

export function rpcPermissionDenied(
  message: string = 'Permission Denied',
  details?: Record<string, unknown>
): never {
  const payload: RpcError = {
    code: 'PERMISSION_DENIED',
    message,
    details,
  }
  throw new RpcException(payload)
}
