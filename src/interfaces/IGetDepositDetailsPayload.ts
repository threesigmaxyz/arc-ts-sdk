import { DataAvailabilityMode } from './DataAvailabilityMode';

export interface IGetDepositDetailsPayload {
  userId: string;
  assetId: string;
  dataAvailabilityMode: DataAvailabilityMode;
  tokenId?: string;
  amount?: string;
}
