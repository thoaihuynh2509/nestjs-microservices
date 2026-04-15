import {RpcError} from '../rpc.type'

export function isRpcError(value: unknown): value is RpcError {
  if (!isRecord(value)) {
    return false
  }

  return typeof value.code === 'string' && typeof value.message === 'string'
}

export function toRpcError(value: unknown): RpcError {
  if (isRpcError(value)) {
    return value
  }

  if (isRecord(value) && typeof value.message === 'string') {
    return {
      code: 'INTERNAL',
      message: value.message,
    }
  }

  return {
    code: 'INTERNAL',
    message: 'Internal server error',
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
