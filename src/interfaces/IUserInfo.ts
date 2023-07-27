import { IRegisteredUser } from "./IRegisteredUser";
import { IVault } from "./IVault";

export interface IUserInfo {
    user: IRegisteredUser;
    vaultsPerAsset: [IVault];
}