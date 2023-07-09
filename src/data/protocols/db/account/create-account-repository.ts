import { CreateAccountParams } from "@/domain/use-cases/account/create-account";
import { AccountModel } from "@/domain/models/account";

export interface CreateAccountRepository {
  create(account: CreateAccountParams): Promise<AccountModel>;
}
