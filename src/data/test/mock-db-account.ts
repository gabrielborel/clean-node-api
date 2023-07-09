import { mockAccountModel } from "@/domain/test";
import { CreateAccountRepository } from "@/data/protocols/db/account/create-account-repository";
import { FindAccountByEmailRepository } from "@/data/protocols/db/account/find-account-by-email-repository";
import { CreateAccountParams } from "@/domain/use-cases/account/create-account";
import { AccountModel } from "@/domain/models/account";
import { FindAccountByAccessTokenRepository } from "@/data/use-cases/account/find-account-by-access-token/db-find-account-by-access-token-protocols";
import { UpdateAccessTokenRepository } from "@/data/protocols/db/account/update-access-token-repository";

export const mockCreateAccountRepository = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create(account: CreateAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new CreateAccountRepositoryStub();
};

export const mockFindAccountByEmailRepository =
  (): FindAccountByEmailRepository => {
    class FindAccountByEmailRepositoryStub
      implements FindAccountByEmailRepository
    {
      async findByEmail(email: string): Promise<AccountModel | null> {
        return new Promise((resolve) => resolve(mockAccountModel()));
      }
    }
    return new FindAccountByEmailRepositoryStub();
  };

export const mockFindAccountByAccessTokenRepository =
  (): FindAccountByAccessTokenRepository => {
    class FindAccountByAccessTokenRepositoryStub
      implements FindAccountByAccessTokenRepository
    {
      async findByAccessToken(
        accessToken: string,
        role?: string | undefined
      ): Promise<AccountModel | null> {
        return mockAccountModel();
      }
    }
    return new FindAccountByAccessTokenRepositoryStub();
  };

export const mockUpdateAccessTokenRepository =
  (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub
      implements UpdateAccessTokenRepository
    {
      async updateAccessToken(id: string, token: string): Promise<void> {
        return new Promise((resolve) => resolve());
      }
    }
    return new UpdateAccessTokenRepositoryStub();
  };
