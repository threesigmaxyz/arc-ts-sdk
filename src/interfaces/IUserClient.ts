import { IStarkExpressAccount } from './IStarkExpressAccount';
import { IRegisteredUser } from './IRegisteredUser';
import { IUserInfo } from './IUserInfo';
import { IGetAllUsersFilter } from './IGetAllUsersFilter';
import { IGetAllUsersResponse } from './IGetAllUsersResponse';

/**
 * Interface for IUserClient object
 *
 * @see setBaseAccount - set base account for wallet
 * @see getBaseAccount - get base account for wallet
 * @see generateStarkAccount - generates a new stark account
 * @see registerStarkUser - registers a stark user with a stark account
 * @see getAllUsersInfo - get all users info with a filter
 * @see getUserInfo - get a given user info by userId
 */
export interface IUserClient {
  /**
   * Set the base account.
   *
   * @param baseAccount - The base account as an IStarkExpressAccount object.
   */
  setBaseAccount(baseAccount: IStarkExpressAccount): void;

  /**
   * Get the base account.
   *
   * @returns The base account (or null if the base account is not set).
   */
  getBaseAccount(): IStarkExpressAccount | null;

  /**
   * Generate a stark account.
   * 
   * @param ethereumPrivateKey - The Ethereum Private Key.
   *
   * @returns An object of type IStarkExpressAccount.
   */
  generateStarkAccount(ethereumPrivateKey: string): IStarkExpressAccount;

  /**
   * Registers a new StarkExpress user.
   * 
   * @param username - StarkExpress Username.
   * @param starkExpressAccount - starkExpress account of type IStarkExpressAccount.
   *
   * @returns An object of type IRegisteredUser.
   */
  registerStarkUser(username: string, starkExpressAccount?: IStarkExpressAccount): Promise<IRegisteredUser>;

  /**
   * Gets user information.
   * 
   * @param userId - StarkExpress Username.
   *
   * @returns An object of type IUserInfo.
   */
  getUserInfo(userId: string): Promise<IUserInfo>;

  /**
   * Gets multiple users information.
   * 
   * @param filter - IGetAllUsersFilter.
   *
   * @returns An object of type IGetAllUsersResponse.
   */
  getAllUsersInfo(filter: IGetAllUsersFilter): Promise<IGetAllUsersResponse>

}
