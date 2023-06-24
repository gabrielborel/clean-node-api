import {
  Middleware,
  FindAccountByAccessToken,
  HttpRequest,
  HttpResponse,
} from "./auth-middleware-protocols";
import { AccessDeniedError } from "../errors";
import { forbidden, ok, serverError } from "../helpers/http/http-helper";

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly findAccountByAccessToken: FindAccountByAccessToken,
    private readonly role?: string
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = request.headers?.["x-access-token"];
      if (!accessToken) return forbidden(new AccessDeniedError());

      const account = await this.findAccountByAccessToken.find(
        accessToken,
        this.role
      );
      if (!account) return forbidden(new AccessDeniedError());

      return ok({ accountId: account.id });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
