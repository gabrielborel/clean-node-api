import { FindAccountByAccessToken } from "../../domain/use-cases/find-account-by-access-token";
import { AccessDeniedError } from "../errors";
import { forbidden, ok } from "../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../protocols";
import { Middleware } from "../protocols/middleware";

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly findAccountByAccessToken: FindAccountByAccessToken
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const accessToken = request.headers?.["x-access-token"];
    if (!accessToken) return forbidden(new AccessDeniedError());

    const account = await this.findAccountByAccessToken.find(accessToken);
    if (!account) return forbidden(new AccessDeniedError());

    return ok({ accountId: account.id });
  }
}
