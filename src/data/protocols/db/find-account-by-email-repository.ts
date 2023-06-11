import { AccountModel } from "../../../domain/models/account";

export interface FindAccountByEmailRepository {
  find(email: string): Promise<AccountModel | null>;
}
