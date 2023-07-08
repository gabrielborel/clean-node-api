import { describe, test, vi, expect } from "vitest";
import { DbFindAccountByAccessToken } from "./db-find-account-by-access-token";
import {
  AccountModel,
  Decrypter,
  FindAccountByAccessTokenRepository,
} from "./db-find-account-by-access-token-protocols";

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "any_email@mail.com",
  password: "hashed_password",
  accessToken: "valid_token",
});

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string | null> {
      return "haha";
    }
  }
  return new DecrypterStub();
};

const makeFindAccountByRepositoryStub =
  (): FindAccountByAccessTokenRepository => {
    class FindAccountByAccessTokenRepositoryStub
      implements FindAccountByAccessTokenRepository
    {
      async findByAccessToken(
        accessToken: string,
        role?: string | undefined
      ): Promise<AccountModel | null> {
        return makeFakeAccount();
      }
    }
    return new FindAccountByAccessTokenRepositoryStub();
  };

type SutType = {
  sut: DbFindAccountByAccessToken;
  decrypterStub: Decrypter;
  findAccountByAccessTokenRepositoryStub: FindAccountByAccessTokenRepository;
};

const makeSut = (): SutType => {
  const decrypter = makeDecrypterStub();
  const findAccountByAccessTokenRepository = makeFindAccountByRepositoryStub();
  const sut = new DbFindAccountByAccessToken(
    decrypter,
    findAccountByAccessTokenRepository
  );
  return {
    sut,
    decrypterStub: decrypter,
    findAccountByAccessTokenRepositoryStub: findAccountByAccessTokenRepository,
  };
};

describe("DbFindAccountByAccessToken Use Case", () => {
  test("should call Decrypter with correct values", async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = vi.spyOn(decrypterStub, "decrypt");
    await sut.find("any_token", "any_role");
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });

  test("should return null if Decrypter returns null", async () => {
    const { sut, decrypterStub } = makeSut();
    vi.spyOn(decrypterStub, "decrypt").mockReturnValueOnce(
      new Promise((resolve) => resolve(null))
    );
    const account = await sut.find("any_token");
    expect(account).toBeNull();
  });

  test("should call FindAccountByTokenRepository with correct value", async () => {
    const { sut, findAccountByAccessTokenRepositoryStub } = makeSut();
    const findAccountByTokenSpy = vi.spyOn(
      findAccountByAccessTokenRepositoryStub,
      "findByAccessToken"
    );
    await sut.find("any_token", "any_role");
    expect(findAccountByTokenSpy).toHaveBeenCalledWith("any_token", "any_role");
  });

  test("should return null if FindAccountByTokenRepository returns null", async () => {
    const { sut, findAccountByAccessTokenRepositoryStub } = makeSut();
    vi.spyOn(
      findAccountByAccessTokenRepositoryStub,
      "findByAccessToken"
    ).mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.find("any_token");
    expect(account).toBeNull();
  });

  test("should return an account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.find("any_token");
    expect(account).toEqual(makeFakeAccount());
  });

  test("should throw if Decrypter throws", async () => {
    const { sut, decrypterStub } = makeSut();
    vi.spyOn(decrypterStub, "decrypt").mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );
    const promise = sut.find("any_token");
    await expect(promise).rejects.toThrow();
  });

  test("should throw if FindAccountByTokenRepository throws", async () => {
    const { sut, findAccountByAccessTokenRepositoryStub } = makeSut();
    vi.spyOn(
      findAccountByAccessTokenRepositoryStub,
      "findByAccessToken"
    ).mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );
    const promise = sut.find("any_token");
    await expect(promise).rejects.toThrow();
  });
});
