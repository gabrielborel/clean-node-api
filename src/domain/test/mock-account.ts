import { AccountModel } from "@/domain/models/account";
import { CreateAccountParams } from "@/domain/use-cases/account/create-account";
import { AuthenticationParams } from "@/domain/use-cases/account/authentication";

export const mockAccountModel = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
  accessToken: "any_token",
});

export const mockCreateAccountParams = (): CreateAccountParams => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

export const mockCreateAccountParamsWithRole = (): CreateAccountParams & {
  role: string;
} => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
  role: "admin",
});

export const mockCreateAccountParamsWithAccessToken =
  (): CreateAccountParams & {
    accessToken: string;
  } => ({
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    accessToken: "any_token",
  });

export const mockCreateAccountParamsWithAccessTokenAndAccessToken =
  (): CreateAccountParams & {
    accessToken: string;
    role: string;
  } => ({
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    accessToken: "any_token",
    role: "admin",
  });

export const mockAuthentication = (): AuthenticationParams => ({
  email: "any_email@mail.com",
  password: "any_password",
});
