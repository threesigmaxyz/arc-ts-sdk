export enum ASSET_TYPE {
  ETH = 'Eth',
  ERC_20 = 'Erc20',
  ERC_721 = 'Erc721',
  ERC_1155 = 'Erc1155',
  MINTABLE_ERC20 = 'MintableErc20',
  MINTABLE_ERC721 = 'MintableErc721',
}

/**
 * Represents an asset.
 *
 */
export interface IAsset {
  assetId: string;
  assetType?: string;
  address?: string;
  name?: string;
  symbol?: string;
  quantum: string;
  type: ASSET_TYPE;
}
