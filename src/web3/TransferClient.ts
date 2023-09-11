import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import {
  Configuration,
  TransferApi,
  TransferDetailsDto,
  TransferDetailsModel,
  TransferModel,
  VaultDto,
} from '../gen';
import { ResponseData } from '../interfaces/ResponseData';
import { ITransferClient } from '../interfaces/ITransferClient';
import { IStarkExpressAccount } from '../interfaces/IStarkExpressAccount';
import { AxiosResponse } from 'axios';
import { stripHexPrefix } from 'ethereumjs-util';
import { ec, sign } from '@starkware-industries/starkware-crypto-utils';

/**
 * A client class for interacting with the Transfer API of Arc.
 *
 * @remarks
 * The TransferClient manages transfers. It extends the BaseClient
 * class and implements the ITransferClient interface.
 */
export class TransferClient extends BaseClient implements ITransferClient {
  private transferApi: TransferApi;
  private baseStarkExpressAccount: IStarkExpressAccount;

  /**
   * Constructor of the {@link TransferClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.transferApi = new TransferApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.setBaseAccount = this.setBaseAccount.bind(this);
    this.getBaseAccount = this.getBaseAccount.bind(this);
    this.transferAsset = this.transferAsset.bind(this);
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
   * Transfer assets from one user to another
   *
   * @param transferData - The details to complete a transfer
   *
   * @returns a promise that resolves to an object of `ResponseData<{ Array<VaultDto> }>`.
   */
  public async transferAsset(
    transferData: TransferDetailsModel,
  ): Promise<ResponseData<Array<VaultDto>>> {
    if (!this.baseStarkExpressAccount) {
      throw new Error(`Missing StarkExpressAccount to sign transfers with`);
    }

    // Get transfer details
    const transferDetailsData: ResponseData<TransferDetailsDto> =
      await this.getTransferDetails(transferData);

    if (transferDetailsData.error) {
      throw new Error(JSON.stringify(transferDetailsData.error, null, 4));
    }

    const transferDetails = transferDetailsData.result as TransferDetailsDto;

    // Sign transfer message
    const keyPair = ec.keyFromPrivate(
      stripHexPrefix(this.baseStarkExpressAccount.ethereumAccount.secretKey),
      'hex',
    );
    const starkSignature = sign(keyPair, transferDetails.signablePayload);

    // Build transfer request
    const transferModel: TransferModel = {
      senderVaultId: transferDetails.senderVaultId,
      receiverVaultId: transferDetails.receiverVaultId,
      quantizedAmount: transferDetails.quantizedAmount,
      expirationTimestamp: transferDetails.expirationTimestamp,
      nonce: transferDetails.nonce,
      signature: {
        r: starkSignature.r.toString('hex'),
        s: starkSignature.s.toString('hex'),
      },
    };

    // Send transfer
    return await this.sanitizeResponse<Array<VaultDto>>(
      this.transferApi.transfer(transferModel),
    );
  }

  private async getTransferDetails(
    transferDetailsModel: TransferDetailsModel,
  ): Promise<ResponseData<TransferDetailsDto>> {
    const resp: Promise<AxiosResponse<TransferDetailsDto, undefined>> =
      this.transferApi.transferDetails(transferDetailsModel);
    return (await this.sanitizeResponse(
      resp,
    )) as ResponseData<TransferDetailsDto>;
  }
}
