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

// common
export { IAccount } from './interfaces/IAccount';
export { IStarkAccount } from './interfaces/IStarkAccount';
export { IStarkExpressAccount } from './interfaces/IStarkExpressAccount';
export { IClientConfig } from './interfaces/IClientConfig';
export { IPagination } from './interfaces/IPagination';
export { IClient } from './interfaces/IClient';
export { IProvider } from './interfaces/IProvider';
export { ResponseData } from './interfaces/ResponseData';
export { EOperationStatus } from './interfaces/EOperationStatus';
export { IGetAllEntitiesResponse } from './interfaces/IGetAllEntitiesResponse';

// users
export { IUserClient } from './interfaces/IUserClient';
export { IVault } from './interfaces/IVault';
export { IUserInfo } from './interfaces/IUserInfo';
export { IRegisteredUser } from './interfaces/IRegisteredUser';
export { IGetAllUsersFilter } from './interfaces/IGetAllUsersFilter';

// assets
export { IAssetsClient } from './interfaces/IAssetsClient';
export { IAsset } from './interfaces/IAsset';
export { IGetAllAssetsFilter } from './interfaces/IGetAllAssetsFilter';

/** Exposed clients and factories */
export { ClientFactory, DefaultProviderUrls } from './web3/ClientFactory';
export { Client } from './web3/Client';
export { UserClient } from './web3/UserClient';
export { AssetsClient } from './web3/AssetsClient';
