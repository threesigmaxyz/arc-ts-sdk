import { FeeDataDto } from './FeeDataDto';

export class OrderDataDto {
  /**
   * The amount to be sold, in quantized form.
   */
  sellQuantizedAmount: string;
  /**
   * The amount to be bough, in quantized form.
   */
  buyQuantizedAmount: string;

  /**
   * The amount to be sold, in quantized form.
   */
  assetSell: string;
  /**
   * The asset to be bough, in quantized form.
   */
  assetBuy: string;

  /**
   * The vault chain ID for the asset being sold.
   */
  sellVaultChainId: number;
  /**
   * The vault chain ID for the asset being bought.
   */
  buyVaultChainId: number;
  /**
   * The fee data for the order
   */
  fee?: FeeDataDto;
  /**
   * The timestamp at which this order becomes invalid, in seconds since the Unix epoch.
   */
  expirationTimestamp: number;
  /**
   * The unique nonce for the order.
   */
  nonce: number;
}
