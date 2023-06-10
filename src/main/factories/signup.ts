import { DbCreateAccount } from "../../data/use-cases/create-account/db-create-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { MongoAccountRepository } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentations/controllers/signup/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";

export const makeSignUpController = (): SignUpController => {
  const SALT = 12;
  const bcryptAdapter = new BcryptAdapter(SALT);
  const emailValidator = new EmailValidatorAdapter();
  const accountRepository = new MongoAccountRepository();
  const createAccount = new DbCreateAccount(bcryptAdapter, accountRepository);
  return new SignUpController(emailValidator, createAccount);
};
