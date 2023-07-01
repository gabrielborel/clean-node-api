import { SignInController } from "@/presentations/controllers/login/signin/signin-controller";
import { Controller } from "@/presentations/protocols";
import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller-decorator-factory";
import { makeDbAuthentication } from "@/main/factories/use-cases/account/authentication/authentication-factory";
import { makeSignInValidation } from "./signin-validation-factory";

export const makeSignInController = (): Controller => {
  const authentication = makeDbAuthentication();
  const validation = makeSignInValidation();
  return makeLogControllerDecorator(
    new SignInController(authentication, validation)
  );
};
