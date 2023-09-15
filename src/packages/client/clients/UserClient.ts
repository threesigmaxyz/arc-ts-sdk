/* eslint-disable @typescript-eslint/no-var-requires */
import { IClientConfig } from '../interfaces/IClientConfig';
import { BaseClient } from './BaseClient';
import { IUserClient } from '../interfaces/IUserClient';
import { IEIP712SignableDataUrlParams } from '../interfaces/IEIP712SignableDataUrlParams';
import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util';
import { IRegisteredUser } from '../interfaces/IRegisteredUser';
import { IUserInfo } from '../interfaces/IUserInfo';
import { IGetAllEntitiesResponse } from '../interfaces/IGetAllEntitiesResponse';
import { ResponseData } from '../interfaces/ResponseData';
import {
  Configuration,
  RegisterDetailsDto,
  RegisterUserModel,
  UserApi,
  UserDtoPaginatedResponseDto,
} from '../gen';
import { AxiosResponse } from 'axios';
import { IGetAllUsersFilter } from '../interfaces/IGetAllUsersFilter';

/**
 * A client class for interacting with the user API of Arc.
 *
 * @remarks
 * The UserClient manages creating and registering new stark users as well as retrieving information on existing ones. It extends the BaseClient
 * class and implements the IUserClient interface.
 */
export class UserClient extends BaseClient implements IUserClient {
  private usersApi: UserApi;

  /**
   * Constructor of the {@link UserClient} class.
   *
   * @param clientConfig - Configuration parameters for the client.
   */
  public constructor(clientConfig: IClientConfig) {
    super(clientConfig);

    // bind generated client
    this.usersApi = new UserApi({
      apiKey: clientConfig.apiKey,
      basePath: clientConfig.provider.url,
    } as Configuration);

    // bound methods
    this.getAllUsersInfo = this.getAllUsersInfo.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);

    this.getEIP712SignableData = this.getEIP712SignableData.bind(this);
    this.registerNewUser = this.registerNewUser.bind(this);
  }

  public async getEIP712SignableData<T extends MessageTypes>(
    queryParams: IEIP712SignableDataUrlParams,
  ): Promise<ResponseData<TypedMessage<T>>> {
    const resp: Promise<AxiosResponse<RegisterDetailsDto, undefined>> =
      this.usersApi.eIP712Details(
        queryParams.username,
        queryParams.starkKey,
        queryParams.address,
      );
    return (await this.sanitizeResponse(resp)) as ResponseData<TypedMessage<T>>;
  }

  public async registerNewUser(
    userData: RegisterUserModel,
  ): Promise<ResponseData<IRegisteredUser>> {
    return await this.sanitizeResponse<IRegisteredUser>(
      this.usersApi.registerUser(userData),
    );
  }

  /**
   * Get User Info by userId.
   *
   * @param userId - The userId to get the info for
   *
   * @returns a promise that resolves to an object of IUserInfo.
   */
  public async getUserInfo(userId: string): Promise<ResponseData<IUserInfo>> {
    return await this.sanitizeResponse<IUserInfo>(
      this.usersApi.getUser(userId),
    );
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
    const resp: Promise<AxiosResponse<UserDtoPaginatedResponseDto, undefined>> =
      this.usersApi.getAllUsers(
        filter.username,
        filter.usernameComparison,
        filter.address,
        filter.creationDate,
        filter.creationDateComparison,
        filter.pageNumber,
        filter.pageSize,
        filter.sortBy,
      );

    return (await this.sanitizeResponse<UserDtoPaginatedResponseDto>(
      resp,
    )) as ResponseData<IGetAllEntitiesResponse<IRegisteredUser>>;
  }
}
