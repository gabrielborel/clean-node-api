import { DbAuthentication } from "./db-authentication";
import {
  HashComparer,
  UpdateAccessTokenRepository,
  Encrypter,
  AuthenticationModel,
  FindAccountByEmailRepository,
  AccountModel,
} from "./db-authentication-protocols";

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "any_email@mail.com",
  password: "hashed_password",
  accessToken: "valid_token",
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "any_email@mail.com",
  password: "any_password",
});

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HashComparerStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return "access_token";
    }
  }
  return new EncrypterStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

const makeFindAccountByEmailRepository = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub
    implements FindAccountByEmailRepository
  {
    async findByEmail(email: string): Promise<AccountModel | null> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new FindAccountByEmailRepositoryStub();
};

type SutType = {
  sut: DbAuthentication;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const makeSut = (): SutType => {
  const hashComparer = makeHashComparer();
  const findAccountByEmailRepository = makeFindAccountByEmailRepository();
  const Encrypter = makeEncrypter();
  const updateAccessTokenRepository = makeUpdateAccessTokenRepository();
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
    await sut.auth(makeFakeAuthentication());
    expect(findSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("should throw if FindAccountByEmailRepository throws", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "findByEmail")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return null if FindAccountByEmailRepository returns null", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "findByEmail")
      .mockResolvedValueOnce(null);
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  test("should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const authData = makeFakeAuthentication();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(authData);
    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  test("should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockResolvedValueOnce(false);
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  test("should call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.auth(makeFakeAuthentication());
    expect(encryptSpy).toHaveBeenCalledWith("valid_id");
  });

  test("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return a token on success", async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBe("access_token");
  });

  test("should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken"
    );
    await sut.auth(makeFakeAuthentication());
    expect(updateSpy).toHaveBeenCalledWith("valid_id", "access_token");
  });

  test("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
