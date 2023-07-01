import { SignUpController } from "@/presentations/controllers/login/signup/signup-controller";
import { Controller } from "@/presentations/protocols";
import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller-decorator-factory";
import { makeDbCreateAccount } from "@/main/factories/use-cases/account/create-account/create-account-factory";
import { makeDbAuthentication } from "@/main/factories/use-cases/account/authentication/authentication-factory";
import { makeSignUpValidation } from "./signup-validation-factory";

export const makeSignUpController = (): Controller => {
  const createAccount = makeDbCreateAccount();
  const validation = makeSignUpValidation();
  const authentication = makeDbAuthentication();
  return makeLogControllerDecorator(
    new SignUpController(createAccount, validation, authentication)
  );
};
