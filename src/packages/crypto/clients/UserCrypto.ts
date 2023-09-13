/* eslint-disable @typescript-eslint/no-var-requires */
import { IUserCrypto } from '../interfaces/IUserCrypto';
import { IStarkAccount } from '../interfaces/IStarkAccount';
import { stripHexPrefix } from 'ethereumjs-util';
import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util';
import { RegisterUserModel } from '../../client/gen';
import starkwareCrypto from '@starkware-industries/starkware-crypto-utils';
import { ec } from '@starkware-industries/starkware-crypto-utils/dist/src/js/signature';
import { TypedDataDomain } from 'ethers/lib.commonjs/hash/typed-data';
import { JsonRpcSigner } from 'ethers/lib.commonjs/providers/provider-jsonrpc';

/**
 * A client class for interacting with the user API of StarkExpress.
 *
 * @remarks
 * The UserClient manages creating and registering new stark users as well as retrieving information on existing ones. It extends the BaseClient
 * class and implements the IUserClient interface.
 */
export class UserCrypto implements IUserCrypto {
  private signer: JsonRpcSigner;
  private starkAccount: IStarkAccount;

  /**
   * Constructor of the {@link UserCrypto} class.
   *
   */
  public constructor(wallet: JsonRpcSigner, starkAccount: IStarkAccount) {
    this.signer = wallet;
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
    const eip712Signature = await this.signer.signTypedData(
      data.domain,
      data.types,
      data.message,
    );

    // Sign the Ethereum address => create stark signature
    const keyPair = ec.keyFromPrivate(this.starkAccount.secretKey, 'hex');
    const starkSignature = starkwareCrypto.sign(
      keyPair,
      starkwareCrypto.pedersen([stripHexPrefix(this.signer.address)]),
    );
    const r = starkSignature.r.toString('hex');
    const s = starkSignature.s.toString('hex');

    return {
      username,
      address: this.signer.address,
      eip712Signature,
      starkKey: this.starkAccount.publicKey,
      starkSignature: { r, s },
    } as RegisterUserModel;
  }
}
