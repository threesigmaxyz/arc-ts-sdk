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
export { ClientFactory, DefaultProviderUrls } from './web3/ClientFactory';
export { Client } from './web3/Client';
export { IAccount } from './interfaces/IAccount';
export { IStarkAccount } from './interfaces/IStarkAccount';
export { IStarkExpressAccount } from './interfaces/IStarkExpressAccount';
export { IClientConfig } from './interfaces/IClientConfig';
export { IPagination } from './interfaces/IPagination';
export { IClient } from './interfaces/IClient';
export { IProvider } from './interfaces/IProvider';
export { ResponseData } from './interfaces/ResponseData';
export { IGetAllEntitiesResponse } from './interfaces/IGetAllEntitiesResponse';

// users
export { UserClient } from './web3/UserClient';
export { IUserClient } from './interfaces/IUserClient';
export { IUserInfo } from './interfaces/IUserInfo';
export { IRegisteredUser } from './interfaces/IRegisteredUser';
export { IGetAllUsersFilter } from './interfaces/IGetAllUsersFilter';

// assets
export { AssetsClient } from './web3/AssetsClient';
export { IAssetsClient } from './interfaces/IAssetsClient';
export { IAsset } from './interfaces/IAsset';
export { IGetAllAssetsFilter } from './interfaces/IGetAllAssetsFilter';

// fees
export { FeeClient } from './web3/FeeClient';
export { IFeeClient } from './interfaces/IFeeClient';
export { IFeeModel } from './interfaces/IFeeModel';

// operations
export { OperationsClient } from './web3/OperationsClient';
export { IOperationsClient } from './interfaces/IOperationsClient';
export { IDepositDetails } from './interfaces/IDepositDetails';
export { ITransferDetails } from './interfaces/ITransferDetails';
export { ITransactionDetails } from './interfaces/ITransactionDetails';
export { IWithdrawAsset } from './interfaces/IWithdrawAsset';
export { IWithdrawDetails } from './interfaces/IWithdrawDetails';
export { IGetAllTransactionsFilter } from './interfaces/IGetAllTransactionsFilter';

// vaults
export { VaultClient } from './web3/VaultClient';
export { IVaultClient } from './interfaces/IVaultClient';
export { IVault } from './interfaces/IVault';
export { IGetAllVaultsFilter } from './interfaces/IGetAllVaultsFilter';
