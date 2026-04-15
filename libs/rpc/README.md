# `@app/rpc`

Shared RPC conventions for NestJS microservices.

## What this library provides

- Global setup for microservice apps (`ValidationPipe` + `RpcExceptionFilter`)
- Shared RPC error contract (`RpcError`, `RpcErrorCode`)
- Helper functions to throw typed `RpcException`

## Error code standard

This package is standardized on **gRPC-style error codes** only:

- `INVALID_ARGUMENT`
- `UNAUTHENTICATED`
- `PERMISSION_DENIED`
- `NOT_FOUND`
- `ALREADY_EXISTS`
- `FAILED_PRECONDITION`
- `RESOURCE_EXHAUSTED`
- `OUT_OF_RANGE`
- `UNIMPLEMENTED`
- `UNAVAILABLE`
- `ABORTED`
- `DATA_LOSS`
- `INTERNAL`

## Usage

```ts
import {applyToMicroservice, rpcNotFound} from '@app/rpc'
```

### Setup per service

```ts
applyToMicroservice(app)
```

### Throw standardized RPC errors

```ts
rpcInvalidArgument('Invalid payload')
rpcUnauthenticated('Missing token')
rpcPermissionDenied('Insufficient role')
rpcNotFound('Product not found')
```

## Compatibility note

- `rpcBadRequest` is kept as a compatibility wrapper and maps to `INVALID_ARGUMENT`.
- `rpcUnauthorized` is kept as a compatibility wrapper and maps to `UNAUTHENTICATED`.


Frontend gọi GET /products/abc vào gateway.
Gateway gọi RPC sang catalog.
catalog throw lỗi RPC { code: 'NOT_FOUND', message: 'Product not found' }.
Gateway bắt lỗi RPC, dùng mapRpcCodeToHttpStatus('NOT_FOUND') -> 404.
Frontend nhận HTTP 404 nhất quán.