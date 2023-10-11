/* eslint-disable @typescript-eslint/no-var-requires */
import { ICryptoUtils } from '../interfaces/ICryptoUtils';
import { UserCrypto } from './UserCrypto';
import { DepositCrypto } from './DepositCrypto';
import { TransferCrypto } from './TransferCrypto';
import { WithdrawCrypto } from './WithdrawCrypto';
import { IDepositCrypto } from '../interfaces/IDepositCrypto';
import { IUserCrypto } from '../interfaces/IUserCrypto';
import { ITransferCrypto } from '../interfaces/ITransferCrypto';
import { IWithdrawCrypto } from '../interfaces/IWithdrawCrypto';
import { IStarkAccount } from '../interfaces/IStarkAccount';
import { JsonRpcSigner } from 'ethers/lib.commonjs/providers/provider-jsonrpc';
import { ethers } from 'ethers';
import { ISettlementCrypto } from '../interfaces/ISettlementCrypto';
import { SettlementCrypto } from './SettlementCrypto';
import { IEthereumWallet } from '../interfaces/IEthereumWallet';
const starkwareCrypto = require('@starkware-industries/starkware-crypto-utils');

/**
 * Arc Web3 CryptoUtils client object wraps all user, deposit, transfer, withdraw, and settlement functionalities.
 */
export class CryptoUtils implements ICryptoUtils {
  private isInit: boolean;
  private userClient: UserCrypto;
  private depositClient: DepositCrypto;
  private transferClient: TransferCrypto;
  private withdrawClient: WithdrawCrypto;
  private settlementClient: SettlementCrypto;
  public starkAccount: IStarkAccount;
  public signer: JsonRpcSigner;

  /**
   * Constructor of the CryptoUtils class.
   *
   * @param clientConfig - client configuration object.
   * @param baseAccount - base account to use for signing transactions (optional).
   */
  public constructor() {
    this.isInit = false;
    this.init = this.init.bind(this);

    // subclients
    this.user = this.user.bind(this);
    this.deposits = this.deposits.bind(this);
    this.transfers = this.transfers.bind(this);
    this.withdraws = this.withdraws.bind(this);
    this.settlements = this.settlements.bind(this);
  }

  /**
   * Initialize the CryptoUtils sdk with the user's wallet and a message to sign
   *
   */
  public async init(
    message: string,
    ethereumWallet?: IEthereumWallet,
  ): Promise<void> {
    let provider: ethers.JsonRpcProvider | ethers.BrowserProvider = undefined;
    if (ethereumWallet) {
      provider = new ethers.JsonRpcProvider(ethereumWallet.providerUrl);
      this.signer = await provider.getSigner(ethereumWallet.privateKey);
    } else {
      // A Web3Provider wraps a standard Web3 provider, which is
      // what MetaMask injects as window.ethereum into each page
      const { ethereum } = window as any;
      if (!ethereum) {
        const msg =
          'Metamask is not available. Ethereum object does not exist under window';
        console.error(msg);
        throw new Error(msg);
      }
      provider = new ethers.BrowserProvider(ethereum);
      // The MetaMask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      this.signer = await provider.getSigner();
    }

    // MetaMask requires requesting permission to connect users accounts
    await provider.send('eth_requestAccounts', []);

    // Generate Stark keys
    const ethSignature = await this.signer.signMessage(message);
    const starkPrivateKey =
      starkwareCrypto.keyDerivation.getPrivateKeyFromEthSignature(ethSignature);
    const starkPublicKey =
      starkwareCrypto.keyDerivation.privateToStarkKey(starkPrivateKey);

    // TODO Test this, may need to transform into hex string
    this.starkAccount = {
      secretKey: starkPrivateKey,
      publicKey: starkPublicKey,
    } as IStarkAccount;

    this.userClient = new UserCrypto(this.signer, this.starkAccount);
    this.depositClient = new DepositCrypto(this.signer);
    this.transferClient = new TransferCrypto(this.starkAccount);
    this.withdrawClient = new WithdrawCrypto(this.signer);
    this.settlementClient = new SettlementCrypto(this.starkAccount);

    this.isInit = true;
  }

  /**
   * Get the deposit-related methods.
   *
   * @returns IDepositCrypto object.
   */
  public deposits(): IDepositCrypto {
    if (!this.isInit) {
      throw new Error(`Client must be initialized first`);
    }

    return this.depositClient;
  }

  /**
   * Get the user-related methods.
   *
   * @returns IUserCrypto object.
   */
  public user(): IUserCrypto {
    if (!this.isInit) {
      throw new Error(`Client must be initialized first`);
    }

    return this.userClient;
  }

  /**
   * Get the transfer-related methods.
   *
   * @returns ITransferCrypto object.
   */
  public transfers(): ITransferCrypto {
    if (!this.isInit) {
      throw new Error(`Client must be initialized first`);
    }

    return this.transferClient;
  }

  /**
   * Get the withdraw-related methods.
   *
   * @returns IWithdrawCrypto object.
   */
  public withdraws(): IWithdrawCrypto {
    if (!this.isInit) {
      throw new Error(`Client must be initialized first`);
    }

    return this.withdrawClient;
  }

  /**
   * Get the settlement-related methods.
   *
   * @returns ISettlementCrypto object.
   */
  public settlements(): ISettlementCrypto {
    if (!this.isInit) {
      throw new Error(`Client must be initialized first`);
    }

    return this.settlementClient;
  }
}
