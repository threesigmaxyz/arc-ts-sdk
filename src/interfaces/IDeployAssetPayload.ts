import { ASSET_TYPE } from './IAsset';

export interface IDeployAssetPayload {
  type: ASSET_TYPE;
  name: string;
  symbol: string;
  uri?: string;
  quantum?: string;
}
