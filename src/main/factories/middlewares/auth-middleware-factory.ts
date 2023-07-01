import { AuthMiddleware } from "@/presentations/middlewares/auth-middleware";
import { Middleware } from "@/presentations/protocols";
import { makeDbFindAccountByAccessToken } from "../use-cases/account/find-account-by-access-token/find-account-by-access-token-factory";

export const makeAuthMiddlware = (role?: string): Middleware => {
  const dbFindAccountByAccessToken = makeDbFindAccountByAccessToken();
  return new AuthMiddleware(dbFindAccountByAccessToken, role);
};
