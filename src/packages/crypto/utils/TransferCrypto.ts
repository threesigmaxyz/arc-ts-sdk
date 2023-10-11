/* eslint-disable @typescript-eslint/no-var-requires */
import { SignatureModel, TransferDetailsDto } from '../../client/gen';
import { ITransferCrypto } from '../interfaces/ITransferCrypto';
const starkwareCrypto = require('@starkware-industries/starkware-crypto-utils');
import { IStarkAccount } from '../interfaces/IStarkAccount';

/**
 * A client class for interacting with the Transfer API of Arc.
 *
 * @remarks
 * The TransferCrypto manages transfers and implements the ITransferCrypto interface.
 */
export class TransferCrypto implements ITransferCrypto {
  private starkAccount: IStarkAccount;

  /**
   * Constructor of the {@link TransferCrypto} class.
   *
   */
  public constructor(starkAccount: IStarkAccount) {
    this.starkAccount = starkAccount;

    // bound methods
    this.signTransfer = this.signTransfer.bind(this);
  }

  /**
   * Transfer assets from one user to another
   *
   * @param transferData - The details to complete a transfer
   *
   * @returns a promise that resolves to an object of `SignatureModel`.
   */
  public signTransfer(transferData: TransferDetailsDto): SignatureModel {
    // Sign transfer message
    const keyPair = starkwareCrypto.ec.keyFromPrivate(
      this.starkAccount.secretKey,
      'hex',
    );
    const starkSignature = starkwareCrypto.sign(
      keyPair,
      transferData.signablePayload,
    );

    return {
      r: starkSignature.r.toString('hex'),
      s: starkSignature.s.toString('hex'),
    } as SignatureModel;
  }
}
