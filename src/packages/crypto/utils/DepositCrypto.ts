import { DepositDetailsDto } from '../../client/gen';
import { IDepositCrypto } from '../interfaces/IDepositCrypto';
import { erc20Abi } from '../abi/erc20';
import { erc721Abi } from '../abi/erc721';
import { erc1155Abi } from '../abi/erc1155';
import { starkexAbi } from '../abi/starkex';
import { JsonRpcSigner } from 'ethers/lib.commonjs/providers/provider-jsonrpc';
import { ethers } from 'ethers';

/**
 * A client class for interacting with the Deposit API of Arc.
 *
 * @remarks
 * The DepositCrypto manages deposits. It implements the IDepositCrypto interface.
 */
export class DepositCrypto implements IDepositCrypto {
  private signer: JsonRpcSigner;

  /**
   * Constructor of the {@link DepositCrypto} class.
   *
   */
  public constructor(signer: JsonRpcSigner) {
    this.signer = signer;

    this.deposit = this.deposit.bind(this);
  }

  public async deposit(depositData: DepositDetailsDto): Promise<void> {
    await this.depositOnChain(depositData);
  }

  private async depositOnChain(depositData: DepositDetailsDto): Promise<void> {
    try {
      if (depositData.depositFunction != 'depositEth') {
        await this.approveTransferForArc(depositData);
      }
      await this.executeDeposit(depositData);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async approveTransferForArc(
    depositData: DepositDetailsDto,
  ): Promise<void> {
    const abi = this.getAssetContractAbi(depositData.depositFunction);
    const assetContract = new ethers.Contract(
      depositData.assetContractAddress,
      abi,
      this.signer,
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

  private async executeDeposit(depositData: DepositDetailsDto): Promise<void> {
    const arcContract = new ethers.Contract(
      depositData.operatorContractAddress,
      starkexAbi,
      this.signer,
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
