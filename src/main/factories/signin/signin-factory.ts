import { DbAuthentication } from "../../../data/use-cases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/criptography/jwt/jwt-adapter";
import { MongoAccountRepository } from "../../../infra/db/mongodb/account/mongo-account-repository";
import { MongoLogRepository } from "../../../infra/db/mongodb/log/mongo-log-repository";
import { SignInController } from "../../../presentations/controllers/signin/signin-controller";
import { Controller } from "../../../presentations/protocols";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { makeSignInValidation } from "./signin-validation-factory";
import { environment } from "../../config/env";

export const makeSignInController = (): Controller => {
  const SALT = 12;
  const accountMongoRepository = new MongoAccountRepository();
  const bcryptAdapter = new BcryptAdapter(SALT);
  const jwtAdapter = new JwtAdapter(environment.jwtSecret);
  const authentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
  const validation = makeSignInValidation();
  const signinController = new SignInController(authentication, validation);
  const mongoLogRepository = new MongoLogRepository();
  return new LogControllerDecorator(signinController, mongoLogRepository);
};
