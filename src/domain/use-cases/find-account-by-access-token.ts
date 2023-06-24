import { AccountModel } from "../models/account";

export interface FindAccountByAccessToken {
  find(accessToken: string, role?: string): Promise<AccountModel | null>;
}
