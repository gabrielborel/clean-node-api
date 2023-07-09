import { mockAccountModel } from "@/domain/test";
import { DbFindAccountByAccessToken } from "./db-find-account-by-access-token";
import {
  Decrypter,
  FindAccountByAccessTokenRepository,
} from "./db-find-account-by-access-token-protocols";
import {
  mockDecrypter,
  mockFindAccountByAccessTokenRepository,
} from "@/data/test";

type SutType = {
  sut: DbFindAccountByAccessToken;
  decrypterStub: Decrypter;
  findAccountByAccessTokenRepositoryStub: FindAccountByAccessTokenRepository;
};

const makeSut = (): SutType => {
  const decrypter = mockDecrypter();
  const findAccountByAccessTokenRepository =
    mockFindAccountByAccessTokenRepository();
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
    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");
    await sut.find("any_token", "any_role");
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });

  test("should return null if Decrypter returns null", async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, "decrypt").mockResolvedValueOnce(null);
    const account = await sut.find("any_token");
    expect(account).toBeNull();
  });

  test("should call FindAccountByTokenRepository with correct value", async () => {
    const { sut, findAccountByAccessTokenRepositoryStub } = makeSut();
    const findAccountByTokenSpy = jest.spyOn(
      findAccountByAccessTokenRepositoryStub,
      "findByAccessToken"
    );
    await sut.find("any_token", "any_role");
    expect(findAccountByTokenSpy).toHaveBeenCalledWith("any_token", "any_role");
  });

  test("should return null if FindAccountByTokenRepository returns null", async () => {
    const { sut, findAccountByAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(findAccountByAccessTokenRepositoryStub, "findByAccessToken")
      .mockResolvedValueOnce(null);
    const account = await sut.find("any_token");
    expect(account).toBeNull();
  });

  test("should return an account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.find("any_token");
    expect(account).toEqual(mockAccountModel());
  });

  test("should throw if Decrypter throws", async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, "decrypt").mockRejectedValueOnce(new Error());
    const promise = sut.find("any_token");
    await expect(promise).rejects.toThrow();
  });

  test("should throw if FindAccountByTokenRepository throws", async () => {
    const { sut, findAccountByAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(findAccountByAccessTokenRepositoryStub, "findByAccessToken")
      .mockRejectedValueOnce(new Error());
    const promise = sut.find("any_token");
    await expect(promise).rejects.toThrow();
  });
});
