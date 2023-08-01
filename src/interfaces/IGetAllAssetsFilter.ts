import { ITEM_COMPARISON } from './EItemComparison';
import { ASSET_TYPE } from './IAsset';

export interface IGetAllAssetsFilter {
  assetId?: string;
  assetType: ASSET_TYPE;
  assetTypeComparison?: ITEM_COMPARISON;
  assetSymbol?: string;
  assetSymbolComparison?: ITEM_COMPARISON;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
}
