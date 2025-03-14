import {
  getPermissionsHandler,
  requestPermissionsHandler,
  revokePermissionsHandler,
} from '@metamask/multichain';
import { makeMethodMiddlewareMaker } from '../utils';
import { localHandlers, eip1193OnlyHandlers } from '../handlers';

// TODO: [ffmcgee] use typescript, some type gymnastics required on `makeMethodMiddlewareMaker` args

// The primary home of RPC method implementations for the injected 1193 provider API. MUST be subsequent
// to our permission logic in the EIP-1193 JSON-RPC middleware pipeline.
export const createEip1193MethodMiddleware = makeMethodMiddlewareMaker([
  ...localHandlers,
  ...eip1193OnlyHandlers,
  // EIP-2255 Permission handlers
  getPermissionsHandler,
  requestPermissionsHandler,
  revokePermissionsHandler,
]);
