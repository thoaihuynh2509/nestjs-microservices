import {HttpStatus} from '@nestjs/common'
import {RpcErrorCode} from './rpc.type'

const HTTP_STATUS_TO_RPC_CODE: Partial<Record<HttpStatus, RpcErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: 'INVALID_ARGUMENT',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHENTICATED',
  [HttpStatus.FORBIDDEN]: 'PERMISSION_DENIED',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'ALREADY_EXISTS',
  [HttpStatus.PRECONDITION_FAILED]: 'FAILED_PRECONDITION',
  [HttpStatus.PAYLOAD_TOO_LARGE]: 'OUT_OF_RANGE',
  [HttpStatus.TOO_MANY_REQUESTS]: 'RESOURCE_EXHAUSTED',
  [HttpStatus.NOT_IMPLEMENTED]: 'UNIMPLEMENTED',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'UNAVAILABLE',
}

const RPC_CODE_TO_HTTP_STATUS: Record<RpcErrorCode, HttpStatus> = {
  INVALID_ARGUMENT: HttpStatus.BAD_REQUEST,
  UNAUTHENTICATED: HttpStatus.UNAUTHORIZED,
  PERMISSION_DENIED: HttpStatus.FORBIDDEN,
  NOT_FOUND: HttpStatus.NOT_FOUND,
  ALREADY_EXISTS: HttpStatus.CONFLICT,
  FAILED_PRECONDITION: HttpStatus.PRECONDITION_FAILED,
  RESOURCE_EXHAUSTED: HttpStatus.TOO_MANY_REQUESTS,
  OUT_OF_RANGE: HttpStatus.BAD_REQUEST,
  UNIMPLEMENTED: HttpStatus.NOT_IMPLEMENTED,
  UNAVAILABLE: HttpStatus.SERVICE_UNAVAILABLE,
  ABORTED: HttpStatus.CONFLICT,
  DATA_LOSS: HttpStatus.INTERNAL_SERVER_ERROR,
  INTERNAL: HttpStatus.INTERNAL_SERVER_ERROR,
}

export function mapHttpStatusToRpcCode(status: number): RpcErrorCode {
  return (HTTP_STATUS_TO_RPC_CODE[status] ?? 'INTERNAL') as RpcErrorCode
}

export function mapRpcCodeToHttpStatus(code: RpcErrorCode): HttpStatus {
  return RPC_CODE_TO_HTTP_STATUS[code] ?? HttpStatus.INTERNAL_SERVER_ERROR
}
