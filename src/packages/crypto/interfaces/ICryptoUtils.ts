import { IUserCrypto } from './IUserCrypto';
import { IDepositCrypto } from './IDepositCrypto';
import { ITransferCrypto } from './ITransferCrypto';
import { IWithdrawCrypto } from './IWithdrawCrypto';
import { JsonRpcSigner } from 'ethers/lib.commonjs/providers/provider-jsonrpc';
import { IStarkAccount } from './IStarkAccount';

/**
 * Represents the client object.
 *
 * @remarks
 * This interface is used to get handles to different APIs. It also provides methods for setting
 * custom and default providers. The default providers are the global connection URLs
 * for Arc's MAINNET, TESTNET.
 *
 * @see user() - user API client.
 * @see assets() - assets API client.
 * @see fees() -fees API client.
 */
export interface ICryptoUtils {
  init(message: string): Promise<void>;
  user(): IUserCrypto;
  deposits(): IDepositCrypto;
  transfers(): ITransferCrypto;
  withdraws(): IWithdrawCrypto;
  signer: JsonRpcSigner;
  starkAccount: IStarkAccount;
}
