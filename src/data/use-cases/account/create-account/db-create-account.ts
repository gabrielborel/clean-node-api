import {
  AccountModel,
  CreateAccount,
  CreateAccountModel,
  CreateAccountRepository,
  FindAccountByEmailRepository,
  Hasher,
} from "./db-create-account-protocols";

export class DbCreateAccount implements CreateAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly createAccountRepository: CreateAccountRepository,
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository
  ) {}

  async create(accountData: CreateAccountModel): Promise<AccountModel | null> {
    const accountExists = await this.findAccountByEmailRepository.findByEmail(
      accountData.email
    );
    if (accountExists) {
      return null;
    }
    const hashedPassword = await this.hasher.hash(accountData.password);
    const account = Object.assign({}, accountData, {
      password: hashedPassword,
    });
    const createdAccount = await this.createAccountRepository.create(account);
    return createdAccount;
  }
}
