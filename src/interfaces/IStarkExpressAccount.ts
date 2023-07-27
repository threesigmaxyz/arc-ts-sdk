import { IAccount } from "./IAccount";
import { IStarkAccount } from "./IStarkAccount";

/**
 * Represents the structure of a StarkExpress Account object.
 *
 * @see starkAccount - The stark account.
 * @see ethereumAccount - The linked Ethereum account.
 */
export interface IStarkExpressAccount {
  starkAccount: IStarkAccount;
  ethereumAccount: IAccount;
}
