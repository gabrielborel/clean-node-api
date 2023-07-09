import { AccountModel } from "@/domain/models/account";

export type CreateAccountParams = Omit<AccountModel, "id" | "accessToken">;

export interface CreateAccount {
  create(account: CreateAccountParams): Promise<AccountModel | null>;
}
