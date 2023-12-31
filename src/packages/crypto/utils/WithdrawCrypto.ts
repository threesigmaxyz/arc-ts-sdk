/* eslint-disable @typescript-eslint/no-var-requires */
import { WithdrawDetailsDto } from '../../client/gen';
import { IWithdrawCrypto } from '../interfaces/IWithdrawCrypto';
import { ethers } from 'ethers';
import { starkexAbi } from '../abi/starkex';
import { SigningWallet } from './Wallet';

/**
 * A client class for interacting with the withdraws API of Arc.
 *
 * @remarks
 * The WithdrawCrypto manages withdraws and implements the IWithdrawCrypto interface.
 */
export class WithdrawCrypto implements IWithdrawCrypto {
  private wallet: SigningWallet;

  /**
   * Constructor of the {@link WithdrawCrypto} class.
   *
   */
  public constructor(wallet: SigningWallet) {
    this.wallet = wallet;

    // bound methods
    this.withdrawOnChain = this.withdrawOnChain.bind(this);
  }

  /**
   * Executes the on-chain withdraw, transferring the funds from the Arc smart-contract to the withdrawing user
   *
   */
  public async withdrawOnChain(
    withdrawDetails: WithdrawDetailsDto,
  ): Promise<void> {
    const arcContract = new ethers.Contract(
      withdrawDetails.operatorContractAddress,
      starkexAbi,
      this.wallet.getSigner(),
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
}
