import { DbAuthentication } from "../../../../../data/use-cases/authentication/db-authentication";
import { BcryptAdapter } from "../../../../../infra/criptography/bcrypt/bcrypt-adapter";
import { JwtAdapter } from "../../../../../infra/criptography/jwt/jwt-adapter";
import { MongoAccountRepository } from "../../../../../infra/db/mongodb/account/mongo-account-repository";
import { environment } from "../../../../config/env";

export const makeDbAuthentication = (): DbAuthentication => {
  const SALT = 12;
  const accountMongoRepository = new MongoAccountRepository();
  const bcryptAdapter = new BcryptAdapter(SALT);
  const jwtAdapter = new JwtAdapter(environment.jwtSecret);
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
};
