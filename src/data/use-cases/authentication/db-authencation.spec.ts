import { describe, test, vi, expect } from "vitest";
import { DbAuthentication } from "./db-authentication";
import {
  HashComparer,
  UpdateAccessTokenRepository,
  TokenGenerator,
  AuthenticationModel,
  FindAccountByEmailRepository,
  AccountModel,
} from "./db-authentication-protocols";

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

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HashComparerStub();
};

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return "access_token";
    }
  }
  return new TokenGeneratorStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

const makeFindAccountByEmailRepository = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub
    implements FindAccountByEmailRepository
  {
    async find(email: string): Promise<AccountModel | null> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new FindAccountByEmailRepositoryStub();
};

interface SutType {
  sut: DbAuthentication;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeSut = (): SutType => {
  const hashComparer = makeHashComparer();
  const findAccountByEmailRepository = makeFindAccountByEmailRepository();
  const tokenGenerator = makeTokenGenerator();
  const updateAccessTokenRepository = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    findAccountByEmailRepository,
    hashComparer,
    tokenGenerator,
    updateAccessTokenRepository
  );
  return {
    sut,
    findAccountByEmailRepositoryStub: findAccountByEmailRepository,
    hashComparerStub: hashComparer,
    tokenGeneratorStub: tokenGenerator,
    updateAccessTokenRepositoryStub: updateAccessTokenRepository,
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

  test("should return null if FindAccountByEmailRepository returns null", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    vi.spyOn(findAccountByEmailRepositoryStub, "find").mockResolvedValueOnce(
      null
    );
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  test("should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const authData = makeFakeAuthentication();
    const compareSpy = vi.spyOn(hashComparerStub, "compare");
    await sut.auth(authData);
    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  test("should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();
    vi.spyOn(hashComparerStub, "compare").mockRejectedValueOnce(new Error());
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();
    vi.spyOn(hashComparerStub, "compare").mockResolvedValueOnce(false);
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  test("should call TokenGenerator with correct id", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = vi.spyOn(tokenGeneratorStub, "generate");
    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toHaveBeenCalledWith("valid_id");
  });

  test("should throw if TokenGenerator throws", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    vi.spyOn(tokenGeneratorStub, "generate").mockRejectedValueOnce(new Error());
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
    const updateSpy = vi.spyOn(updateAccessTokenRepositoryStub, "update");
    await sut.auth(makeFakeAuthentication());
    expect(updateSpy).toHaveBeenCalledWith("valid_id", "access_token");
  });

  test("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    vi.spyOn(updateAccessTokenRepositoryStub, "update").mockRejectedValueOnce(
      new Error()
    );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
