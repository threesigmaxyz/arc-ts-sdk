import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import {
  Configuration,
  DepositDetailsDto,
  DepositApi,
  DepositDetailsModel,
} from '../gen';
import { IDepositClient } from '../interfaces/IDepositClient';
import { ResponseData } from '../interfaces/ResponseData';
import { ethers, Wallet } from 'ethers';
import { IStarkExpressAccount } from '../interfaces/IStarkExpressAccount';
import { starkexAbi } from './abi/starkex';
import { erc20Abi } from './abi/erc20';
import { erc721Abi } from './abi/erc721';
import { erc1155Abi } from './abi/erc1155';

/**
 * A client class for interacting with the Deposit Assets API of Arc.
 *
 * @remarks
 * The DepositClient manages deposits. It extends the BaseClient
 * class and implements the IDepositClient interface.
 */
export class DepositClient extends BaseClient implements IDepositClient {
  private baseStarkExpressAccount?: IStarkExpressAccount;
  private depositApi: DepositApi;

  /**
   * Constructor of the {@link DepositClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.depositApi = new DepositApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.setBaseAccount = this.setBaseAccount.bind(this);
    this.getBaseAccount = this.getBaseAccount.bind(this);
    this.depositAssets = this.depositAssets.bind(this);
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

  public async depositAssets(
    depositData: DepositDetailsModel,
  ): Promise<ResponseData<DepositDetailsDto>> {
    const response = await this.sanitizeResponse<DepositDetailsDto>(
      this.depositApi.depositDetails(depositData),
    );

    if (response.error) {
      throw new Error(JSON.stringify(response.error));
    }

    await this.depositOnChain(response.result);

    return response;
  }

  private async depositOnChain(depositData: DepositDetailsDto): Promise<void> {
    const signer = new ethers.Wallet(
      this.baseStarkExpressAccount.ethereumAccount.secretKey,
      this.getJsonRpcProvider(),
    );

    try {
      if (depositData.depositFunction != 'depositEth') {
        await this.approveTransferForArc(depositData, signer);
      }
      await this.executeDeposit(depositData, signer);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async approveTransferForArc(
    depositData: DepositDetailsDto,
    signer: Wallet,
  ): Promise<void> {
    const abi = this.getAssetContractAbi(depositData.depositFunction);
    const assetContract = new ethers.Contract(
      depositData.assetContractAddress,
      abi,
      signer,
    );

    switch (depositData.depositFunction) {
      case 'depositERC20':
        await assetContract.approve(
          depositData.operatorContractAddress,
          depositData.amount,
        );
        break;
      case 'depositNft':
        await assetContract.approve(
          depositData.operatorContractAddress,
          depositData.tokenId,
        );
        break;
      case 'depositERC1155':
        await assetContract.setApprovalForAll(
          depositData.operatorContractAddress,
          true,
        );
        break;
      default:
        throw new Error('Invalid deposit_function');
    }
  }

  private async executeDeposit(
    depositData: DepositDetailsDto,
    signer: Wallet,
  ): Promise<void> {
    const arcContract = new ethers.Contract(
      depositData.operatorContractAddress,
      starkexAbi,
      signer,
    );

    switch (depositData.depositFunction) {
      case 'depositEth':
        await arcContract.deposit(
          depositData.starkKey,
          depositData.assetType,
          depositData.vaultId,
          depositData.quantizedAmount,
        );
        break;
      case 'depositERC20':
        await arcContract.depositERC20(
          depositData.starkKey,
          depositData.assetType,
          depositData.vaultId,
          depositData.quantizedAmount,
        );
        break;
      case 'depositNft':
        await arcContract.depositNft(
          depositData.starkKey,
          depositData.assetType,
          depositData.vaultId,
          depositData.tokenId,
        );
        break;
      case 'depositERC1155':
        await arcContract.depositERC1155(
          depositData.starkKey,
          depositData.assetType,
          depositData.tokenId,
          depositData.vaultId,
          depositData.quantizedAmount,
        );
        break;
      default:
        throw new Error('Invalid deposit_function');
    }
  }

  private getAssetContractAbi(depositFunction: string) {
    switch (depositFunction) {
      case 'depositERC20':
        return erc20Abi;
      case 'depositNft':
        return erc721Abi;
      case 'depositERC1155':
        return erc1155Abi;
      default:
        throw new Error('Invalid deposit function');
    }
  }
}
