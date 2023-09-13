import { IRegisteredUser } from './IRegisteredUser';
import { IUserInfo } from './IUserInfo';
import { IGetAllEntitiesResponse } from './IGetAllEntitiesResponse';
import { ResponseData } from './ResponseData';
import { IGetAllUsersFilter } from './IGetAllUsersFilter';
import { IEIP712SignableDataUrlParams } from './IEIP712SignableDataUrlParams';
import {
  MessageTypes,
  TypedMessage,
} from '@metamask/eth-sig-util/dist/sign-typed-data';
import { RegisterUserModel } from '../gen';

/**
 * Interface for IUserClient object
 *
 * @see registerStarkUser - registers a stark user with a stark account
 * @see getAllUsersInfo - get all users info with a filter
 * @see getUserInfo - get a given user info by userId
 */
export interface IUserClient {
  getEIP712SignableData<T extends MessageTypes>(
    queryParams: IEIP712SignableDataUrlParams,
  ): Promise<ResponseData<TypedMessage<T>>>;

  /**
   * Registers a new StarkExpress user.
   *
   *
   * @returns An object of type IRegisteredUser.
   * @param userData - Request model to register a new user in the Arc API
   */
  registerNewUser(
    userData: RegisterUserModel,
  ): Promise<ResponseData<IRegisteredUser>>;

  /**
   * Gets user information.
   *
   * @param userId - StarkExpress Username.
   *
   * @returns An object of type IUserInfo.
   */
  getUserInfo(userId: string): Promise<ResponseData<IUserInfo>>;

  /**
   * Gets multiple users information.
   *
   * @param filter - IGetAllUsersFilter.
   *
   * @returns An object of type IGetAllUsersResponse.
   */
  getAllUsersInfo(
    filter: IGetAllUsersFilter,
  ): Promise<ResponseData<IGetAllEntitiesResponse<IRegisteredUser>>>;
}
