import { CreateAccountModel } from "../../../domain/use-cases/create-account";
import { AccountModel } from "../../../domain/models/account";

export interface CreateAccountRepository {
  create(account: CreateAccountModel): Promise<AccountModel>;
}
