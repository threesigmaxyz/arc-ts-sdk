import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import { IStarkExpressAccount } from '../interfaces/IStarkExpressAccount';
import { ResponseData } from '../interfaces/ResponseData';
import { IOperationsClient } from '../interfaces/IOperationsClient';
import { IDepositDetails } from '../interfaces/IDepositDetails';
import {
  BatchMintRequestModel,
  Configuration,
  DepositApi,
  DepositDetailsModel,
  MintApi,
  TransactionApi,
  TransactionDtoPaginatedResponseDto,
  TransferApi,
  TransferDetailsModel,
  TransferModel,
  WithdrawApi,
  WithdrawModel,
} from '../gen';
import { IVault } from '../interfaces/IVault';
import { ITransferDetails } from '../interfaces/ITransferDetails';
import { ITransactionDetails } from '../interfaces/ITransactionDetails';
import { IGetAllTransactionsFilter } from '../interfaces/IGetAllTransactionsFilter';
import { AxiosResponse } from 'axios';
import { IGetAllEntitiesResponse } from '../interfaces/IGetAllEntitiesResponse';
import { IWithdrawDetails } from '../interfaces/IWithdrawDetails';

/**
 * A client class for interacting with the operations API of StarkExpress.
 *
 * @remarks
 * The OperationsClient manages deposits, mints, transactions, transfers, withdraws. It extends the BaseClient
 * class and implements the IOperationsClient interface.
 */
export class OperationsClient extends BaseClient implements IOperationsClient {
  private baseStarkExpressAccount?: IStarkExpressAccount;
  private depositsApi: DepositApi;
  private withdrawApi: WithdrawApi;
  private mintApi: MintApi;
  private transferApi: TransferApi;
  private transactionApi: TransactionApi;

  /**
   * Constructor of the {@link OperationsClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated clients
    this.depositsApi = new DepositApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    this.withdrawApi = new WithdrawApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    this.mintApi = new MintApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    this.transferApi = new TransferApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    this.transactionApi = new TransactionApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.setBaseAccount = this.setBaseAccount.bind(this);
    this.getBaseAccount = this.getBaseAccount.bind(this);
    this.getDepositDetailsFotAsset = this.getDepositDetailsFotAsset.bind(this);
  }

  /**
   * Sets a provided account as the default (base) account for the sdk.
   *
   * @param baseAccount - An {@link IStarkExpressAccount} to be set as the base account.
   *
   * @returns A Promise that resolves to `void` when the base account has been set successfully.
   */
  public async setBaseAccount(
    baseAccount: IStarkExpressAccount,
  ): Promise<void> {
    this.baseStarkExpressAccount = baseAccount;
  }

  /**
   * Retrieves the default (base) account of the sdk.
   *
   * @returns The base {@link IStarkExpressAccount} set. If no default account is set, it returns `null`.
   */
  public getBaseAccount(): IStarkExpressAccount | null {
    return this.baseStarkExpressAccount;
  }

  /**
   * Get Deposit Details for asset
   *
   * @param depositDetails - The deposit details to be retrieved
   *
   * @returns a promise that resolves to an object of `ResponseData<IDepositDetails>`.
   */
  public async getDepositDetailsFotAsset(
    depositDetails: DepositDetailsModel,
  ): Promise<ResponseData<IDepositDetails>> {
    return await this.sanitizeResponse<IDepositDetails>(
      this.depositsApi.depositDetails(depositDetails),
    );
  }

  /**
   * Mint Assets in a batch
   *
   * @param mintRequest - The deposit details to be retrieved
   *
   * @returns a promise that resolves to an object of `ResponseData<{ [key: string]: Array<IVault> }>`.
   */
  public async mintAssets(
    mintRequest: BatchMintRequestModel,
  ): Promise<ResponseData<{ [key: string]: Array<IVault> }>> {
    return await this.sanitizeResponse<{ [key: string]: Array<IVault> }>(
      this.mintApi.mintAssets(mintRequest),
    );
  }

  /**
   * Transfer Assets
   *
   * @param transferData - The transfer details to be used
   *
   * @returns a promise that resolves to an object of `ResponseData<[IVault]>`.
   */
  public async transferAsset(
    transferData: TransferModel,
  ): Promise<ResponseData<Array<IVault>>> {
    return await this.sanitizeResponse<Array<IVault>>(
      this.transferApi.transfer(transferData),
    );
  }

  /**
   * Get Transfer Details
   *
   * @param transferDetailsData - The transfer details to be used
   *
   * @returns a promise that resolves to an object of `ResponseData<ITransferDetails>`.
   */
  public async getTransferDetails(
    transferDetailsData: TransferDetailsModel,
  ): Promise<ResponseData<ITransferDetails>> {
    return await this.sanitizeResponse<ITransferDetails>(
      this.transferApi.transferDetails(transferDetailsData),
    );
  }

  /**
   * Get Transaction Details
   *
   * @param transactionId - The transaction Id
   *
   * @returns a promise that resolves to an object of `ResponseData<ITransactionDetails>`.
   */
  public async getTransaction(
    transactionId: string,
  ): Promise<ResponseData<ITransactionDetails>> {
    return await this.sanitizeResponse<ITransactionDetails>(
      this.transactionApi.getTransaction(transactionId),
    );
  }

  /**
   * Get All Transaction Details by Filter.
   *
   * @param filter - The filter used for filtering entries of type `IGetAllTransactionsFilter`
   *
   * @returns a promise that resolves to an object of `ResponseData<ITransactionDetails>`.
   */
  public async getAllTransactions(
    filter: IGetAllTransactionsFilter,
  ): Promise<ResponseData<IGetAllEntitiesResponse<ITransactionDetails>>> {
    const resp: Promise<
      AxiosResponse<TransactionDtoPaginatedResponseDto, any>
    > = this.transactionApi.getAllTransactions(
      filter.transactionStatus,
      filter.transactionStatusComparison,
      filter.starkexTxId,
      filter.starkexTxIdComparison,
      filter.txType,
      filter.txTypeComparison,
      filter.pageNumber,
      filter.pageSize,
      filter.sortBy,
    );
    return (await this.sanitizeResponse<TransactionDtoPaginatedResponseDto>(
      resp,
    )) as ResponseData<IGetAllEntitiesResponse<ITransactionDetails>>;
  }

  /**
   * Withdraw Asset
   *
   * @param withdrawAssetData - The withdrawal details to be used
   *
   * @returns a promise that resolves to an object of `ResponseData<IWithdrawDetails>`.
   */
  public async withdrawAsset(
    withdrawAssetData: WithdrawModel,
  ): Promise<ResponseData<IWithdrawDetails>> {
    return await this.sanitizeResponse<IWithdrawDetails>(
      this.withdrawApi.withdraw(withdrawAssetData),
    );
  }
}
