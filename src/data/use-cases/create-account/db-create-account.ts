import {
  AccountModel,
  CreateAccount,
  CreateAccountModel,
  CreateAccountRepository,
  Hasher,
} from "./db-create-account-protocols";

export class DbCreateAccount implements CreateAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly createAccountRepository: CreateAccountRepository
  ) {}

  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password);
    const account = Object.assign({}, accountData, {
      password: hashedPassword,
    });
    const createdAccount = await this.createAccountRepository.create(account);
    return createdAccount;
  }
}
