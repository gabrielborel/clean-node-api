import { DbCreateAccount } from "../../../../data/use-cases/create-account/db-create-account";
import { BcryptAdapter } from "../../../../infra/criptography/bcrypt/bcrypt-adapter";
import { MongoAccountRepository } from "../../../../infra/db/mongodb/account/mongo-account-repository";

export const makeDbCreateAccount = (): DbCreateAccount => {
  const SALT = 12;
  const bcryptAdapter = new BcryptAdapter(SALT);
  const accountRepository = new MongoAccountRepository();
  return new DbCreateAccount(bcryptAdapter, accountRepository);
};
