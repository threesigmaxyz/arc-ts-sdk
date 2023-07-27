/** Polyfills */
import { Buffer } from 'buffer';
import EventEmitter from 'events';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    EventEmitter: typeof EventEmitter;
  }
}

// Check if we are on browser
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.EventEmitter = EventEmitter;
}

/** Exposed interfaces */
export { IAccount } from './interfaces/IAccount';
export { IClientConfig } from './interfaces/IClientConfig';
export { IProvider } from './interfaces/IProvider';
export { JsonRpcResponseData } from './interfaces/JsonRpcResponseData';
export { EOperationStatus } from './interfaces/EOperationStatus';
export { IClient } from './interfaces/IClient';
export { IUserClient } from './interfaces/IUserClient';

/** Exposed clients and factories */
export { ClientFactory, DefaultProviderUrls } from './web3/ClientFactory';
export { Client } from './web3/Client';
export { UserClient } from './web3/UserClient';
