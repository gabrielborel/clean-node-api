import { DbCreateAccount } from "../../../data/use-cases/create-account/db-create-account";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt/bcrypt-adapter";
import { MongoAccountRepository } from "../../../infra/db/mongodb/account/mongo-account-repository";
import { MongoLogRepository } from "../../../infra/db/mongodb/log/mongo-log-repository";
import { SignUpController } from "../../../presentations/controllers/signup/signup-controller";
import { Controller } from "../../../presentations/protocols";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = (): Controller => {
  const SALT = 12;
  const bcryptAdapter = new BcryptAdapter(SALT);
  const accountRepository = new MongoAccountRepository();
  const createAccount = new DbCreateAccount(bcryptAdapter, accountRepository);
  const validation = makeSignUpValidation();
  const signUpController = new SignUpController(createAccount, validation);
  const logErrorRepository = new MongoLogRepository();
  return new LogControllerDecorator(signUpController, logErrorRepository);
};
