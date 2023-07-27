import { IStarkExpressAccount } from './IStarkExpressAccount';
import { IRegisteredUser } from './IRegisteredUser';
import { IUserInfo } from './IUserInfo';

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

  generateStarkAccount(ethereumPrivateKey: string): IStarkExpressAccount;

  registerStarkUser(username: string, starkExpressAccount?: IStarkExpressAccount): Promise<IRegisteredUser>;

  getAllUsersInfo(message: Uint8Array): Promise<any>;

  getUserInfo(userId: string): Promise<IUserInfo>

}
