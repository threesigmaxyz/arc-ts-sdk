import { OrderDetailsDto, SignatureModel } from '../../client/gen';
import { ec, sign } from '@starkware-industries/starkware-crypto-utils';
import { IStarkAccount } from '../interfaces/IStarkAccount';
import { IMarketplaceCrypto } from '../interfaces/IMarketplaceCrypto';

/**
 * A client class for interacting with the Deposit Assets API of Arc.
 *
 * @remarks
 * The DepositClient manages deposits. It extends the BaseClient
 * class and implements the IDepositClient interface.
 */
export class MarketplaceCrypto implements IMarketplaceCrypto {
  private starkAccount: IStarkAccount;

  /**
   * Constructor of the {@link DepositCrypto} class.
   *
   */
  public constructor(starkAccount: IStarkAccount) {
    this.starkAccount = starkAccount;

    this.signOrder = this.signOrder.bind(this);
  }

  public signOrder(orderDetailsDto: OrderDetailsDto): SignatureModel {
    // Sign order message
    const keyPair = ec.keyFromPrivate(this.starkAccount.secretKey, 'hex');
    const starkSignature = sign(keyPair, orderDetailsDto.signablePayload);

    return {
      r: starkSignature.r.toString('hex'),
      s: starkSignature.s.toString('hex'),
    } as SignatureModel;
  }
}
