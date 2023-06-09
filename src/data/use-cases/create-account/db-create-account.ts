import {
  AccountModel,
  CreateAccount,
  CreateAccountModel,
  CreateAccountRepository,
  Encrypter,
} from "./db-create-account-protocols";

export class DbCreateAccount implements CreateAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly createAccountRepository: CreateAccountRepository
  ) {}

  async create(accountData: CreateAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    const account = Object.assign({}, accountData, {
      password: hashedPassword,
    });
    const createdAccount = await this.createAccountRepository.create(account);
    console.log(createdAccount);
    return createdAccount;
  }
}
