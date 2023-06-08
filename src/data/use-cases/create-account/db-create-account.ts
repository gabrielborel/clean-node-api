import { AccountModel } from "../../../domain/models/account";
import {
  CreateAccount,
  CreateAccountModel,
} from "../../../domain/use-cases/create-account";
import { Encrypter } from "../../protocols/encrypter";

export class DbCreateAccount implements CreateAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async create(account: CreateAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return new Promise((resolve) => resolve({} as AccountModel));
  }
}
