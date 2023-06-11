import { describe, test, vi, expect } from "vitest";
import { AccountModel } from "../create-account/db-create-account-protocols";
import { FindAccountByEmailRepository } from "../../protocols/db/find-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";
import { AuthenticationModel } from "../../../domain/use-cases/authentication";

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "any_email@mail.com",
  password: "hashed_password",
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "any_email@mail.com",
  password: "any_password",
});

const makeFindAccountByEmailRepository = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub
    implements FindAccountByEmailRepository
  {
    async find(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new FindAccountByEmailRepositoryStub();
};

interface SutType {
  sut: DbAuthentication;
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
    await sut.auth(makeFakeAuthentication());
    expect(findSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("should throw if FindAccountByEmailRepository throws", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    vi.spyOn(findAccountByEmailRepositoryStub, "find").mockRejectedValueOnce(
      new Error()
    );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
