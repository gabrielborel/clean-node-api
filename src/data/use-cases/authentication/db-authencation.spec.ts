import { describe, test, vi, expect } from "vitest";
import { AccountModel } from "../create-account/db-create-account-protocols";
import { FindAccountByEmailRepository } from "../../protocols/find-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

const makeFindAccountByEmailRepository = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub
    implements FindAccountByEmailRepository
  {
    async find(email: string): Promise<AccountModel> {
      return new Promise((resolve) =>
        resolve({
          id: "valid_id",
          name: "valid_name",
          email: "any_email@mail.com",
          password: "hashed_password",
        })
      );
    }
  }
  return new FindAccountByEmailRepositoryStub();
};

interface SutType {
  sut: any;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
}

const makeSut = (): SutType => {
  const findAccountByEmailRepository = makeFindAccountByEmailRepository();
  const sut = new DbAuthentication(findAccountByEmailRepository);
  return {
    sut,
    findAccountByEmailRepositoryStub: findAccountByEmailRepository,
  };
};

describe("DbAuthentication UseCase", () => {
  test("should call FindAccountByEmailRepository with correct values", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    const findSpy = vi.spyOn(findAccountByEmailRepositoryStub, "find");
    await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    });
    expect(findSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
