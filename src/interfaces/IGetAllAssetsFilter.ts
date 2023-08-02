import { AssetType, FilterOptions } from '../gen';

export interface IGetAllAssetsFilter {
  assetId?: string;
  assetType?: AssetType;
  assetTypeComparison?: FilterOptions;
  assetSymbol?: string;
  assetSymbolComparison?: FilterOptions;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
}
