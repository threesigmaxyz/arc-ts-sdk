/* eslint-disable @typescript-eslint/no-var-requires */
import { IUserCrypto } from '../interfaces/IUserCrypto';
import { IStarkAccount } from '../interfaces/IStarkAccount';
import { stripHexPrefix } from 'ethereumjs-util';
import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util';
import { RegisterUserModel } from '../../client/gen';
import { TypedDataDomain } from 'ethers/lib.commonjs/hash/typed-data';
import { SigningWallet } from './Wallet';
const starkwareCrypto = require('@starkware-industries/starkware-crypto-utils');

/**
 * A client class for interacting with the users API of Arc.
 *
 * @remarks
 * The UserCrypto manages creating and registering new stark users as well as retrieving information on existing ones. It implements the IUserClient interface.
 */
export class UserCrypto implements IUserCrypto {
  private wallet: SigningWallet;
  private starkAccount: IStarkAccount;

  /**
   * Constructor of the {@link UserCrypto} class.
   *
   */
  public constructor(wallet: SigningWallet, starkAccount: IStarkAccount) {
    this.wallet = wallet;
    this.starkAccount = starkAccount;

    // bound methods
    this.signRegisterDetails = this.signRegisterDetails.bind(this);
  }

  public async signRegisterDetails(
    username: string,
    registerDetails: TypedMessage<MessageTypes>,
  ): Promise<RegisterUserModel> {
    // TODO Is this still needed?
    // sign_eip712_register_message
    registerDetails.message['starkKey'] = stripHexPrefix(
      registerDetails.message['starkKey'] as string,
    );

    const data = {
      domain: registerDetails.domain as TypedDataDomain,
      types: registerDetails.types,
      primaryType: registerDetails.primaryType,
      message: registerDetails.message,
    };

    // TODO Is this still needed?
    data.domain.chainId = data.domain.chainId as number;
    const eip712Signature = await this.wallet.signTypedData(
      data.domain,
      data.types,
      data.message,
    );

    // Sign the Ethereum address => create stark signature
    const keyPair = starkwareCrypto.ec.keyFromPrivate(
      this.starkAccount.secretKey,
      'hex',
    );
    const starkSignature = starkwareCrypto.sign(
      keyPair,
      starkwareCrypto.pedersen([stripHexPrefix(this.wallet.getAddress())]),
    );
    const r = starkSignature.r.toString('hex');
    const s = starkSignature.s.toString('hex');

    return {
      username,
      address: this.wallet.getAddress(),
      eip712Signature,
      starkKey: this.starkAccount.publicKey,
      starkSignature: { r, s },
    } as RegisterUserModel;
  }
}
