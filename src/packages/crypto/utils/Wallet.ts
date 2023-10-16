import { JsonRpcSigner } from 'ethers/lib.commonjs/providers/provider-jsonrpc';
import { TypedDataDomain, TypedDataField, ethers } from 'ethers';

export enum WalletType {
  Injected,
  Native,
}

export class SigningWallet {
  private walletType: WalletType;
  private signer: ethers.Wallet | JsonRpcSigner;

  public constructor(
    walletType: WalletType,
    signer: ethers.Wallet | JsonRpcSigner,
  ) {
    this.walletType = walletType;
    this.signer = signer;
  }

  public getAddress(): string {
    return this.signer.address;
  }

  public async signMessage(message: string | Uint8Array): Promise<string> {
    switch (this.walletType) {
      case WalletType.Injected: {
        if (!this.signer) throw new Error('Wallet signer is not set.');
        if (!(this.signer instanceof ethers.JsonRpcSigner))
          throw new Error(
            'Wallet signer is not an instance of type ethers.JsonRpcSigner.',
          );
        return await this.signer.signMessage(message);
      }
      case WalletType.Native: {
        if (!this.signer) throw new Error('Wallet signer is not set.');
        if (!(this.signer instanceof ethers.Wallet))
          throw new Error(
            'Wallet signer is not an instance of type ethers.Wallet.',
          );
        return await this.signer.signMessage(message);
      }
      default:
        throw new Error('Unknown wallet type');
    }
  }

  public async signTypedData(
    domain: TypedDataDomain,
    types: Record<string, TypedDataField[]>,
    _value: Record<string, any>,
  ): Promise<string> {
    switch (this.walletType) {
      case WalletType.Injected: {
        if (!this.signer) throw new Error('Wallet signer is not set.');
        if (!(this.signer instanceof ethers.JsonRpcSigner))
          throw new Error(
            'Wallet signer is not an instance of type ethers.JsonRpcSigner.',
          );
        return await this.signer.signTypedData(domain, types, _value);
      }
      case WalletType.Native: {
        if (!this.signer) throw new Error('Wallet signer is not set.');
        if (!(this.signer instanceof ethers.Wallet))
          throw new Error(
            'Wallet signer is not an instance of type ethers.Wallet.',
          );
        return await this.signer.signTypedData(domain, types, _value);
      }
      default:
        throw new Error('Unknown wallet type');
    }
  }

  public getSigner(): ethers.Wallet | JsonRpcSigner {
    switch (this.walletType) {
      case WalletType.Injected: {
        if (!this.signer) throw new Error('Wallet signer is not set.');
        if (!(this.signer instanceof ethers.JsonRpcSigner))
          throw new Error(
            'Wallet signer is not an instance of type ethers.JsonRpcSigner.',
          );
        return this.signer;
      }
      case WalletType.Native: {
        if (!this.signer) throw new Error('Wallet signer is not set.');
        if (!(this.signer instanceof ethers.Wallet))
          throw new Error(
            'Wallet signer is not an instance of type ethers.Wallet.',
          );
        return this.signer;
      }
      default:
        throw new Error('Unknown wallet type');
    }
  }
}
