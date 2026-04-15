export type RpcErrorCode =
  | 'INVALID_ARGUMENT'
  | 'UNAUTHENTICATED'
  | 'PERMISSION_DENIED'
  | 'INTERNAL'
  | 'NOT_FOUND'
  | 'ALREADY_EXISTS'
  | 'RESOURCE_EXHAUSTED'
  | 'FAILED_PRECONDITION'
  | 'ABORTED'
  | 'OUT_OF_RANGE'
  | 'UNIMPLEMENTED'
  | 'UNAVAILABLE'
  | 'DATA_LOSS'

export interface RpcError {
  code: RpcErrorCode
  message: string
  details?: Record<string, unknown>
}
