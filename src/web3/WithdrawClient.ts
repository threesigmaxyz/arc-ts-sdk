/* eslint-disable @typescript-eslint/no-var-requires */
import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import { IStarkExpressAccount } from '../interfaces/IStarkExpressAccount';
import {
  Configuration,
  WithdrawApi,
  WithdrawDetailsDto,
  WithdrawModel,
} from '../gen';
import { IWithdrawClient } from '../interfaces/IWithdrawClient';
import { ResponseData } from '../interfaces/ResponseData';
import { ethers } from 'ethers';
import { starkexAbi } from './abi/starkex';
require('@starkware-industries/starkware-crypto-utils');
/**
 * A client class for interacting with the user API of StarkExpress.
 *
 * @remarks
 * The UserClient manages creating and registering new stark users as well as retrieving information on existing ones. It extends the BaseClient
 * class and implements the IUserClient interface.
 */
export class WithdrawClient extends BaseClient implements IWithdrawClient {
  private baseStarkExpressAccount?: IStarkExpressAccount;
  private withdrawApi: WithdrawApi;

  /**
   * Constructor of the {@link WithdrawClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.withdrawApi = new WithdrawApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.setBaseAccount = this.setBaseAccount.bind(this);
    this.getBaseAccount = this.getBaseAccount.bind(this);
    this.withdraw = this.withdraw.bind(this);
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
   * Executes the off-chain withdraw request
   *
   * @returns The withdraw details necessary to call the on-chain withdraw function after the ZK-Proof has ben posted on-chain.
   */
  public async withdraw(
    withdrawModel: WithdrawModel,
  ): Promise<ResponseData<WithdrawDetailsDto>> {
    const withdrawDetailsData = await this.getWithdrawDetails(withdrawModel);

    if (withdrawDetailsData.error) {
      throw new Error(JSON.stringify(withdrawDetailsData.error, null, 4));
    }

    return withdrawDetailsData;
  }

  /**
   * Executes the on-chain withdraw, transferring the funds from the Arc smart-contract to the withdrawing user
   *
   */
  public async withdrawOnChain(
    withdrawDetails: WithdrawDetailsDto,
  ): Promise<void> {
    if (!this.baseStarkExpressAccount) {
      throw new Error(`Missing StarkExpressAccount to withdraw funds`);
    }

    if (!this.getJsonRpcProvider()) {
      throw new Error(`Missing JsonRpc provider`);
    }

    // The starkEx contract
    const signer = new ethers.Wallet(
      this.baseStarkExpressAccount.ethereumAccount.secretKey,
      this.getJsonRpcProvider(),
    );
    const arcContract = new ethers.Contract(
      withdrawDetails.operatorContractAddress,
      starkexAbi,
      signer,
    );

    // Call on-chain withdraw function
    switch (withdrawDetails.withdrawFunction) {
      case 'withdraw':
        await arcContract.withdraw(
          withdrawDetails.starkKey,
          withdrawDetails.assetType,
        );
        break;
      case 'withdrawWithTokenId':
        await arcContract.withdrawWithTokenId(
          withdrawDetails.starkKey,
          withdrawDetails.assetType,
          withdrawDetails.tokenId,
        );
        break;
      case 'withdrawAndMint':
        await arcContract.withdrawAndMint(
          withdrawDetails.starkKey,
          withdrawDetails.assetType,
          withdrawDetails.mintingBlob,
        );
        break;
    }
  }

  private async getWithdrawDetails(
    withdrawModel: WithdrawModel,
  ): Promise<ResponseData<WithdrawDetailsDto>> {
    return await this.sanitizeResponse<WithdrawDetailsDto>(
      this.withdrawApi.withdraw(withdrawModel),
    );
  }
}
