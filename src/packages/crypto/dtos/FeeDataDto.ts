export class FeeDataDto {
  /**
   * The StarkEx ID of the fee asset to be collected.
   */
  assetFee: string;

  /**
   * The vault chain ID of the fee sender.
   */
  vaultChainId: number;

  /**
   * The limit of the fee to be collected.
   */
  limit: string;
}
