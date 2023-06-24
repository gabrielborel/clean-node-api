import { FindAccountByAccessToken } from "../../domain/use-cases/find-account-by-access-token";
import { AccessDeniedError } from "../errors";
import { forbidden } from "../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../protocols";
import { Middleware } from "../protocols/middleware";

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly findAccountByAccessToken: FindAccountByAccessToken
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const accessToken = request.headers?.["x-access-token"];
    if (accessToken) {
      await this.findAccountByAccessToken.find(accessToken);
    }
    return forbidden(new AccessDeniedError());
  }
}
