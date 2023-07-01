import { AccountModel } from "@/domain/models/account";

export interface FindAccountByAccessTokenRepository {
  findByAccessToken(token: string, role?: string): Promise<AccountModel | null>;
}
