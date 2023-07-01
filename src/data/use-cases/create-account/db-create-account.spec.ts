import { test, describe, vi, expect } from "vitest";
import { DbCreateAccount } from "./db-create-account";
import {
  AccountModel,
  CreateAccountModel,
  CreateAccountRepository,
  FindAccountByEmailRepository,
  Hasher,
} from "./db-create-account-protocols";

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new HasherStub();
};

const makeCreateAccountRepository = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create(account: CreateAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new CreateAccountRepositoryStub();
};

const makeFindAccountByEmailRepository = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub
    implements FindAccountByEmailRepository
  {
    async findByEmail(email: string): Promise<AccountModel | null> {
      return new Promise((resolve) => resolve(null));
    }
  }
  return new FindAccountByEmailRepositoryStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "hashed_password",
  accessToken: "valid_token",
});

const makeFakeAccountData = (): CreateAccountModel => ({
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});

type SutType = {
  sut: DbCreateAccount;
  hasherStub: Hasher;
  createAccountRepositoryStub: CreateAccountRepository;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
};

const makeSut = (): SutType => {
  const hasherStub = makeHasher();
  const createAccountRepositoryStub = makeCreateAccountRepository();
  const findAccountByEmailRepositoryStub = makeFindAccountByEmailRepository();
  const sut = new DbCreateAccount(
    hasherStub,
    createAccountRepositoryStub,
    findAccountByEmailRepositoryStub
  );
  return {
    sut,
    hasherStub,
    createAccountRepositoryStub,
    findAccountByEmailRepositoryStub,
  };
};

describe("DbCreateAccount UseCase", () => {
  test("should call Hasher with correct password", async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = vi.spyOn(hasherStub, "hash");
    const accountData = makeFakeAccountData();
    await sut.create(accountData);
    expect(hasherSpy).toHaveBeenCalledWith("valid_password");
  });

  test("should throw if Hasher throws", async () => {
    const { sut, hasherStub } = makeSut();
    vi.spyOn(hasherStub, "hash").mockRejectedValueOnce(new Error());
    const accountData = makeFakeAccountData();
    const promise = sut.create(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("should call CreateAccountRepository with correct data", async () => {
    const { sut, createAccountRepositoryStub } = makeSut();
    const createSpy = vi.spyOn(createAccountRepositoryStub, "create");
    const accountData = makeFakeAccountData();
    await sut.create(accountData);
    expect(createSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password",
    });
  });

  test("should throw if CreateAccountRepository throws", async () => {
    const { sut, createAccountRepositoryStub } = makeSut();
    vi.spyOn(createAccountRepositoryStub, "create").mockRejectedValueOnce(
      new Error()
    );
    const accountData = makeFakeAccountData();
    const promise = sut.create(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("should return an account on succes", async () => {
    const { sut } = makeSut();
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const createdAccount = await sut.create(accountData);
    expect(createdAccount).toEqual(makeFakeAccount());
  });

  test("should call FindAccountByEmailRepository with correct values", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    const findSpy = vi.spyOn(findAccountByEmailRepositoryStub, "findByEmail");
    await sut.create(makeFakeAccountData());
    expect(findSpy).toHaveBeenCalledWith("valid_email@mail.com");
  });

  test("should return null if FindAccountByEmailRepository returns an account", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    vi.spyOn(
      findAccountByEmailRepositoryStub,
      "findByEmail"
    ).mockResolvedValueOnce(makeFakeAccount());
    const accountData = makeFakeAccountData();
    const createdAccount = await sut.create(accountData);
    expect(createdAccount).toBeNull();
  });
});
