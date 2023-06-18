import { SignInController } from "../../../../presentations/controllers/login/signin/signin-controller";
import { Controller } from "../../../../presentations/protocols";
import { makeLogControllerDecorator } from "../../decorators/log-controller-decorator-factory";
import { makeDbAuthentication } from "../../use-cases/authentication/authentication-factory";
import { makeSignInValidation } from "./signin-validation-factory";

export const makeSignInController = (): Controller => {
  const authentication = makeDbAuthentication();
  const validation = makeSignInValidation();
  return makeLogControllerDecorator(
    new SignInController(authentication, validation)
  );
};
