/* eslint-disable @typescript-eslint/no-var-requires */
import { SignatureModel } from '../../client/gen';
import { ISettlementCrypto } from '../interfaces/ISettlementCrypto';
// import starkwareCrypto, {
//  ec,
//  sign,
// } from '@starkware-industries/starkware-crypto-utils';
const starkwareCrypto = require('@starkware-industries/starkware-crypto-utils');
import { IStarkAccount } from '../interfaces/IStarkAccount';
import { OrderDataDto } from '../dtos/OrderDataDto';

/**
 * A client class for interacting with the Deposit Assets API of Arc.
 *
 * @remarks
 * The DepositClient manages deposits. It extends the BaseClient
 * class and implements the IDepositClient interface.
 */
export class SettlementCrypto implements ISettlementCrypto {
  private starkAccount: IStarkAccount;

  /**
   * Constructor of the {@link DepositCrypto} class.
   *
   */
  public constructor(starkAccount: IStarkAccount) {
    this.starkAccount = starkAccount;

    this.signOrder = this.signOrder.bind(this);
  }

  public signOrder(orderData: OrderDataDto): SignatureModel {
    // Sign transfer message
    const keyPair = starkwareCrypto.ec.keyFromPrivate(
      this.starkAccount.secretKey,
      'hex',
    );

    let signablePayload = '';

    if (!orderData.fee) {
      signablePayload = starkwareCrypto.getLimitOrderMsgHash(
        orderData.sellVaultChainId, // - vault_sell (uint31)
        orderData.buyVaultChainId, // - vault_buy (uint31)
        orderData.sellQuantizedAmount, // - amount_sell (uint63 decimal str)
        orderData.buyQuantizedAmount, // - amount_buy (uint63 decimal str)
        orderData.assetSell, // - token_sell (hex str with 0x prefix < prime)
        orderData.assetBuy, // - token_buy (hex str with 0x prefix < prime)
        orderData.nonce, // - nonce (uint31)
        orderData.expirationTimestamp, // - expiration_timestamp (uint22)
      );
    } else {
      signablePayload = starkwareCrypto.getLimitOrderMsgHashWithFee(
        orderData.sellVaultChainId, // - vault_sell (uint31)
        orderData.buyVaultChainId, // - vault_buy (uint31)
        orderData.sellQuantizedAmount, // - amount_sell (uint63 decimal str)
        orderData.buyQuantizedAmount, // - amount_buy (uint63 decimal str)
        orderData.assetSell, // - token_sell (hex str with 0x prefix < prime)
        orderData.assetBuy, // - token_buy (hex str with 0x prefix < prime)
        orderData.nonce, // - nonce (uint31)
        orderData.expirationTimestamp, // - expiration_timestamp (uint22)
        orderData.fee.assetFee,
        orderData.fee.vaultChainId,
        orderData.fee.limit,
      );
    }

    const starkSignature = starkwareCrypto.sign(keyPair, signablePayload);

    return {
      r: starkSignature.r.toString('hex'),
      s: starkSignature.s.toString('hex'),
    } as SignatureModel;
  }
}
