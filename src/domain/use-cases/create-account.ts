import { AccountModel } from "@/domain/models/account";

export type CreateAccountModel = {
  name: string;
  email: string;
  password: string;
};

export interface CreateAccount {
  create(account: CreateAccountModel): Promise<AccountModel | null>;
}
