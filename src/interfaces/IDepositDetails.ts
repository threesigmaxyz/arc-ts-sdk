export interface IDepositDetails {
  operatorContractAddress?: string;
  assetContractAddress?: string;
  depositFunction?: string;
  starkKey?: string;
  assetType?: string;
  tokenId?: string;
  vaultId: string;
  quantizedAmount?: string;
  amount?: string;
}
