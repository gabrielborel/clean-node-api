import { DbFindAccountByAccessToken } from "@/data/use-cases/find-account-by-access-token/db-find-account-by-access-token";
import { JwtAdapter } from "@/infra/criptography/jwt/jwt-adapter";
import { MongoAccountRepository } from "@/infra/db/mongodb/account/mongo-account-repository";
import { environment } from "@/main/config/env";

export const makeDbFindAccountByAccessToken =
  (): DbFindAccountByAccessToken => {
    const decrypter = new JwtAdapter(environment.jwtSecret);
    const mongoAccountRepository = new MongoAccountRepository();
    return new DbFindAccountByAccessToken(decrypter, mongoAccountRepository);
  };
