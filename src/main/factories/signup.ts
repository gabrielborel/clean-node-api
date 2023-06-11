import { DbCreateAccount } from "../../data/use-cases/create-account/db-create-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { MongoAccountRepository } from "../../infra/db/mongodb/account-repository/account";
import { MongoLogRepository } from "../../infra/db/mongodb/log-repository/log";
import { SignUpController } from "../../presentations/controllers/signup/signup";
import { Controller } from "../../presentations/protocols";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LogControllerDecorator } from "../decorators/log";
import { makeSignUpValidation } from "./signup-validation";

export const makeSignUpController = (): Controller => {
  const SALT = 12;
  const bcryptAdapter = new BcryptAdapter(SALT);
  const emailValidator = new EmailValidatorAdapter();
  const accountRepository = new MongoAccountRepository();
  const createAccount = new DbCreateAccount(bcryptAdapter, accountRepository);
  const validation = makeSignUpValidation();
  const signUpController = new SignUpController(
    emailValidator,
    createAccount,
    validation
  );
  const logErrorRepository = new MongoLogRepository();
  return new LogControllerDecorator(signUpController, logErrorRepository);
};
