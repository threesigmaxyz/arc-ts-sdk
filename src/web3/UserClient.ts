/* eslint-disable @typescript-eslint/no-var-requires */
import { IClientConfig } from '../interfaces/IClientConfig';
import { IAccount } from '../interfaces/IAccount';
import { BaseClient } from './BaseClient';
import { trySafeExecute } from '../utils/retryExecuteFunction';
import { IUserClient } from '../interfaces/IUserClient';
import { IStarkAccount } from '../interfaces/IStarkAccount';
import { IEIP712SignableDataUrlParams } from '../interfaces/IEIP712SignableDataUrlParams';
import {
  privateToPublic,
  isHexPrefixed,
  addHexPrefix,
  stripHexPrefix,
  isValidAddress,
  isValidChecksumAddress,
  isValidPublic,
  toChecksumAddress,
  publicToAddress,
} from 'ethereumjs-util';
import {
  MessageTypes,
  SignTypedDataVersion,
  TypedMessage,
  signTypedData,
} from '@metamask/eth-sig-util';
import { IRegisterUserPayload } from '../interfaces/IRegisterUserPayload';
import { IRegisteredUser } from '../interfaces/IRegisteredUser';
import { IStarkExpressAccount } from '../interfaces/IStarkExpressAccount';
const starkwareCrypto = require('@starkware-industries/starkware-crypto-utils');
import { IUserInfo } from '../interfaces/IUserInfo';
import { IGetAllUsersFilter } from '../interfaces/IGetAllUsersFilter';
import { IGetAllEntitiesResponse } from '../interfaces/IGetAllEntitiesResponse';
import { ResponseData } from '../interfaces/ResponseData';

/**
 * A client class for interacting with the user API of StarkExpress.
 *
 * @remarks
 * The UserClient manages creating and registering new stark users as well as retrieving information on existing ones. It extends the BaseClient
 * class and implements the IUserClient interface.
 */
export class UserClient extends BaseClient implements IUserClient {
  private baseStarkExpressAccount?: IStarkExpressAccount;

  /**
   * Constructor of the {@link UserClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bound methods
    this.generateStarkAccount = this.generateStarkAccount.bind(this);
    this.registerStarkUser = this.registerStarkUser.bind(this);
    this.setBaseAccount = this.setBaseAccount.bind(this);
    this.getBaseAccount = this.getBaseAccount.bind(this);
    this.getAllUsersInfo = this.getAllUsersInfo.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.generateStarkAccountFromEthPrivateKey =
      this.generateStarkAccountFromEthPrivateKey.bind(this);
    this.getEIP712SignableData = this.getEIP712SignableData.bind(this);
    this.registerNewUser = this.registerNewUser.bind(this);
  }

  private generateStarkAccountFromEthPrivateKey(
    fullyPrefixedPrivateKey: string,
  ): IStarkAccount {
    const keyPair = starkwareCrypto.ec.keyFromPrivate(
      stripHexPrefix(fullyPrefixedPrivateKey),
      'hex',
    );
    // const _starkPublicKey: string = keyPair.getPublic(true, 'hex');
    const starkSecretKey: string = keyPair.getPrivate('hex');

    const keyPairPub = starkwareCrypto.ec.keyFromPublic(
      keyPair.getPublic(true, 'hex'),
      'hex',
    );
    const publicKeyX = keyPairPub.getPublic().getX();
    return {
      publicKey: publicKeyX.toString('hex'),
      secretKey: starkSecretKey,
    } as IStarkAccount;
  }

  private async getEIP712SignableData<T extends MessageTypes>(
    queryParams: IEIP712SignableDataUrlParams,
  ): Promise<ResponseData<TypedMessage<T>>> {
    const query = new URLSearchParams({
      username: queryParams.username,
      stark_key: queryParams.starkKey,
      address: queryParams.address,
    }).toString();

    return await this.doGenericGetCall<TypedMessage<T>>(
      `${this.getProvider().url}/users/register-details?${query}`,
    );
  }

  private async registerNewUser(
    body: IRegisterUserPayload,
  ): Promise<ResponseData<IRegisteredUser>> {
    return await this.doGenericPostCall<IRegisteredUser>(
      `${this.getProvider().url}/users`,
      body,
    );
  }

  public generateStarkAccount(
    ethereumPrivateKey: string,
  ): IStarkExpressAccount {
    let fullyPrefixedPrivateKey = ethereumPrivateKey;
    if (!isHexPrefixed(ethereumPrivateKey)) {
      fullyPrefixedPrivateKey = addHexPrefix(ethereumPrivateKey);
    }

    const privateKeyBuffer = Buffer.from(
      stripHexPrefix(fullyPrefixedPrivateKey),
      'hex',
    );
    const ethereumPubKey: Buffer = privateToPublic(privateKeyBuffer);
    const fullEthereumPubKeyHex: string = addHexPrefix(
      ethereumPubKey.toString('hex'),
    );

    if (!isValidPublic(ethereumPubKey)) {
      throw new Error(`Invalid Ethereum public key`);
    }

    const ethereumAddress: Buffer = publicToAddress(ethereumPubKey, true);
    const ethereumAddressHex = ethereumAddress.toString('hex');
    const checksummedAddress = toChecksumAddress(
      addHexPrefix(ethereumAddressHex),
    );

    if (!isValidAddress(checksummedAddress)) {
      throw new Error(`Invalid Ethereum address`);
    }

    if (!isValidChecksumAddress(checksummedAddress)) {
      throw new Error(`Invalid Ethereum address checksum`);
    }

    const ethereumAccount = {
      address: checksummedAddress,
      publicKey: fullEthereumPubKeyHex,
      secretKey: fullyPrefixedPrivateKey,
    } as IAccount;
    const starkAccount: IStarkAccount =
      this.generateStarkAccountFromEthPrivateKey(fullyPrefixedPrivateKey);
    return {
      ethereumAccount,
      starkAccount,
    } as IStarkExpressAccount;
  }

  public async registerStarkUser(
    username: string,
    starkExpressAccount?: IStarkExpressAccount,
  ): Promise<ResponseData<IRegisteredUser>> {
    const starkExpressAccountToRegister =
      starkExpressAccount || this.baseStarkExpressAccount;
    if (!starkExpressAccountToRegister) {
      throw new Error(`Missing StarkExpressAccount to register username with`);
    }

    // get register details
    const eip712SignableData: ResponseData<TypedMessage<MessageTypes>> =
      await this.getEIP712SignableData({
        username: username,
        starkKey: starkExpressAccountToRegister.starkAccount.publicKey,
        address: starkExpressAccountToRegister.ethereumAccount.address,
      } as IEIP712SignableDataUrlParams);

    if (eip712SignableData.error) {
      throw new Error(JSON.stringify(eip712SignableData.error, null, 4));
    }

    const result = eip712SignableData.result as TypedMessage<MessageTypes>;

    // sign_eip712_register_message
    result.message['starkKey'] = stripHexPrefix(
      result.message['starkKey'] as string,
    );

    const data = {
      domain: result.domain,
      types: result.types,
      primaryType: result.primaryType,
      message: result.message,
    };
    data.domain.chainId = data.domain.chainId as number;

    const privateKeyBuffer = Buffer.from(
      stripHexPrefix(starkExpressAccountToRegister.ethereumAccount.secretKey),
      'hex',
    );
    const eip712Signature: string = signTypedData({
      privateKey: privateKeyBuffer,
      data: data,
      version: SignTypedDataVersion.V4,
    });

    // Sign the Ethereum address => create stark signature
    const keyPair = starkwareCrypto.ec.keyFromPrivate(
      stripHexPrefix(starkExpressAccountToRegister.ethereumAccount.secretKey),
      'hex',
    );
    const starkSignature = starkwareCrypto.sign(
      keyPair,
      starkwareCrypto.pedersen([
        stripHexPrefix(starkExpressAccountToRegister.ethereumAccount.address),
      ]),
    );
    const r = starkSignature.r.toString('hex');
    const s = starkSignature.s.toString('hex');

    if (this.clientConfig.retryStrategyOn) {
      return await trySafeExecute<ResponseData<IRegisteredUser>>(
        this.registerNewUser,
        [
          {
            username,
            address: starkExpressAccountToRegister.ethereumAccount.address,
            eip712Signature,
            starkKey: starkExpressAccountToRegister.starkAccount.publicKey,
            starkSignature: { r, s },
          } as IRegisterUserPayload,
        ],
      );
    } else {
      return await this.registerNewUser({
        username,
        address: starkExpressAccountToRegister.ethereumAccount.address,
        eip712Signature,
        starkKey: starkExpressAccountToRegister.starkAccount.publicKey,
        starkSignature: { r, s },
      } as IRegisterUserPayload);
    }
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
   * Get User Info by userId.
   *
   * @param userId - The userId to get the info for
   *
   * @returns a promise that resolves to an object of IUserInfo.
   */
  public async getUserInfo(userId: string): Promise<ResponseData<IUserInfo>> {
    if (this.clientConfig.retryStrategyOn) {
      return await trySafeExecute<ResponseData<IUserInfo>>(
        this.doGenericGetCall,
        [`${this.getProvider().url}/users/${userId}`],
      );
    } else {
      return await this.doGenericGetCall<IUserInfo>(
        `${this.getProvider().url}/users/${userId}`,
      );
    }
  }

  /**
   * Get Users Information by Filter.
   *
   * @param filter - The filter used for filtering entries of type `IGetAllUsersFilter`
   *
   * @returns a promise that resolves to an ab oject of `ResponseData<IGetAllEntitiesResponse<IRegisteredUser>>`
   */
  public async getAllUsersInfo(
    filter: IGetAllUsersFilter,
  ): Promise<ResponseData<IGetAllEntitiesResponse<IRegisteredUser>>> {
    let queryBuilder = {};
    if (filter.username) {
      queryBuilder['username'] = filter.username.toString();
    }
    if (filter.usernameComparison) {
      queryBuilder['username_comparison'] =
        filter.usernameComparison.toString();
    }
    if (filter.address) {
      queryBuilder['address'] = filter.address.toString();
    }
    if (filter.creationDate) {
      queryBuilder['creation_date'] = filter.creationDate.toString();
    }
    if (filter.creationDateComparison) {
      queryBuilder['creation_date_comparison'] =
        filter.creationDateComparison.toString();
    }
    if (filter.pageNumber) {
      queryBuilder['page_number'] = filter.pageNumber.toString();
    }
    if (filter.pageSize) {
      queryBuilder['page_size'] = filter.pageSize.toString();
    }
    if (filter.sortBy) {
      queryBuilder['sort_by'] = filter.sortBy.toString();
    }

    const query = new URLSearchParams(queryBuilder).toString();
    if (this.clientConfig.retryStrategyOn) {
      return await trySafeExecute<
        ResponseData<IGetAllEntitiesResponse<IRegisteredUser>>
      >(this.doGenericGetCall, [`${this.getProvider().url}/users?${query}`]);
    } else {
      return await this.doGenericGetCall<
        IGetAllEntitiesResponse<IRegisteredUser>
      >(`${this.getProvider().url}/users?${query}`);
    }
  }
}
