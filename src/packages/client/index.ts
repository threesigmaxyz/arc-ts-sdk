/** Exposed interfaces */

// common
export { ClientFactory, DefaultProviderUrls } from './clients/ClientFactory';
export { Client } from './clients/Client';
export { type IAccount } from './interfaces/IAccount';
export { type IClientConfig } from './interfaces/IClientConfig';
export { type IPagination } from './interfaces/IPagination';
export { type IClient } from './interfaces/IClient';
export { type IProvider } from './interfaces/IProvider';
export { type ResponseData } from './interfaces/ResponseData';
export { type IGetAllEntitiesResponse } from './interfaces/IGetAllEntitiesResponse';
export {
  type FilterOptions,
  DataAvailabilityModes,
  type DepositDetailsModel,
  type TransferDetailsDto,
  type TransferDetailsModel,
  type TransferModel,
  type WithdrawDetailsDto,
  type WithdrawModel,
} from './gen';

// users
export { type IUserInfo } from './interfaces/IUserInfo';
export { type IRegisteredUser } from './interfaces/IRegisteredUser';
export { type IGetAllUsersFilter } from './interfaces/IGetAllUsersFilter';

// assets
export { type IAsset } from './interfaces/IAsset';
export { type IGetAllAssetsFilter } from './interfaces/IGetAllAssetsFilter';

// fees
export { type IFeeModel } from './interfaces/IFeeModel';

// operations
export { type IDepositDetails } from './interfaces/IDepositDetails';
export { type ITransferDetails } from './interfaces/ITransferDetails';
export { type ITransactionDetails } from './interfaces/ITransactionDetails';
export { type IWithdrawAsset } from './interfaces/IWithdrawAsset';
export { type IWithdrawDetails } from './interfaces/IWithdrawDetails';
export { type IGetAllTransactionsFilter } from './interfaces/IGetAllTransactionsFilter';

// vaults
export { type IVault } from './interfaces/IVault';
export { type IGetAllVaultsFilter } from './interfaces/IGetAllVaultsFilter';
