import { AccountModel } from "@/domain/models/account";

export type CreateAccountModel = Omit<AccountModel, "id" | "accessToken">;

export interface CreateAccount {
  create(account: CreateAccountModel): Promise<AccountModel | null>;
}
