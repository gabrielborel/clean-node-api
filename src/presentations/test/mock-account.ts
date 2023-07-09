import {
  Authentication,
  AuthenticationParams,
} from "@/domain/use-cases/account/authentication";
import {
  CreateAccount,
  CreateAccountParams,
} from "@/domain/use-cases/account/create-account";
import { FindAccountByAccessToken } from "@/domain/use-cases/account/find-account-by-access-token";
import { AccountModel } from "@/domain/models/account";
import { mockAccountModel } from "@/domain/test";

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(data: AuthenticationParams): Promise<string> {
      return Promise.resolve("access_token");
    }
  }
  return new AuthenticationStub();
};

export const mockCreateAccount = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    async create(data: CreateAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new CreateAccountStub();
};

export const mockFindAccountByAccessToken = () => {
  class FindAccountByAccessTokenStub implements FindAccountByAccessToken {
    async find(
      accessToken: string,
      role?: string | undefined
    ): Promise<AccountModel | null> {
      return mockAccountModel();
    }
  }
  return new FindAccountByAccessTokenStub();
};
