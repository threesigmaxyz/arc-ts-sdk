export enum DATA_AVAILABILITY_MODE {
  ZK_ROLLUP = 'ZkRollup',
  VALIDIUM = 'Validium',
}

/**
 * Represents a Vault.
 *
 */
export interface IVault {
  vaultId: string;
  vaultChainId: string;
  starkExAddress?: string;
  assetSymbol?: string;
  tokenId?: string;
  mintingBlob?: string;
  assetStarkExId?: string;
  userStarkKey?: string;
  availableBalance: string;
  accountingBalance: string;
  dataAvailabilityMode: DATA_AVAILABILITY_MODE;
}
