import {
  mockEncrypter,
  mockFindAccountByEmailRepository,
  mockHashComparer,
  mockUpdateAccessTokenRepository,
} from "@/data/test";
import { mockAuthentication } from "@/domain/test";
import { DbAuthentication } from "./db-authentication";
import {
  Encrypter,
  FindAccountByEmailRepository,
  HashComparer,
  UpdateAccessTokenRepository,
} from "./db-authentication-protocols";

type SutType = {
  sut: DbAuthentication;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const makeSut = (): SutType => {
  const hashComparer = mockHashComparer();
  const findAccountByEmailRepository = mockFindAccountByEmailRepository();
  const Encrypter = mockEncrypter();
  const updateAccessTokenRepository = mockUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    findAccountByEmailRepository,
    hashComparer,
    Encrypter,
    updateAccessTokenRepository
  );
  return {
    sut,
    findAccountByEmailRepositoryStub: findAccountByEmailRepository,
    hashComparerStub: hashComparer,
    encrypterStub: Encrypter,
    updateAccessTokenRepositoryStub: updateAccessTokenRepository,
  };
};

describe("DbAuthentication UseCase", () => {
  test("should call FindAccountByEmailRepository with correct values", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(findAccountByEmailRepositoryStub, "findByEmail");
    await sut.auth(mockAuthentication());
    expect(findSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("should throw if FindAccountByEmailRepository throws", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "findByEmail")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return null if FindAccountByEmailRepository returns null", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "findByEmail")
      .mockResolvedValueOnce(null);
    const accessToken = await sut.auth(mockAuthentication());
    expect(accessToken).toBeNull();
  });

  test("should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const authData = mockAuthentication();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(authData);
    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  test("should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockResolvedValueOnce(false);
    const accessToken = await sut.auth(mockAuthentication());
    expect(accessToken).toBeNull();
  });

  test("should call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.auth(mockAuthentication());
    expect(encryptSpy).toHaveBeenCalledWith("any_id");
  });

  test("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return a token on success", async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(mockAuthentication());
    expect(accessToken).toBe("access_token");
  });

  test("should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken"
    );
    await sut.auth(mockAuthentication());
    expect(updateSpy).toHaveBeenCalledWith("any_id", "access_token");
  });

  test("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
