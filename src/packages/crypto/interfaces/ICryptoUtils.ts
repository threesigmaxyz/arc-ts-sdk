import { IUserCrypto } from './IUserCrypto';
import { IDepositCrypto } from './IDepositCrypto';
import { ITransferCrypto } from './ITransferCrypto';
import { IWithdrawCrypto } from './IWithdrawCrypto';
import { JsonRpcSigner } from 'ethers/lib.commonjs/providers/provider-jsonrpc';
import { IStarkAccount } from './IStarkAccount';
import { ISettlementCrypto } from './ISettlementCrypto';
import { IEthereumWallet } from './IEthereumWallet';
import { IMarketplaceCrypto } from './IMarketplaceCrypto';

/**
 * Represents the ICryptoUtils Wrapper object.
 *
 * @remarks
 * This interface is used to provide a wrapper around various crypto-related subclients
 *
 * @see user() - user client.
 * @see deposits() - deposits client.
 * @see transfers() -transfers client.
 * @see withdraws() -withdraws client.
 * @see settlements() -settlements client.
 */
export interface ICryptoUtils {
  init(message: string, ethereumWallet?: IEthereumWallet): Promise<void>;
  user(): IUserCrypto;
  deposits(): IDepositCrypto;
  transfers(): ITransferCrypto;
  withdraws(): IWithdrawCrypto;
  settlements(): ISettlementCrypto;
  marketplace(): IMarketplaceCrypto;
  signer: JsonRpcSigner;
  starkAccount: IStarkAccount;
}
