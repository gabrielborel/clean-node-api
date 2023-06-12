import { test, describe, vi, expect } from "vitest";
import { DbCreateAccount } from "./db-create-account";
import {
  AccountModel,
  CreateAccountModel,
  CreateAccountRepository,
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

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "hashed_password",
});

const makeFakeAccountData = (): CreateAccountModel => ({
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});

interface SutType {
  sut: DbCreateAccount;
  hasherStub: Hasher;
  createAccountRepositoryStub: CreateAccountRepository;
}

const makeSut = (): SutType => {
  const hasherStub = makeHasher();
  const createAccountRepositoryStub = makeCreateAccountRepository();
  const sut = new DbCreateAccount(hasherStub, createAccountRepositoryStub);
  return { sut, hasherStub, createAccountRepositoryStub };
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
    vi.spyOn(hasherStub, "hash").mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );

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
    vi.spyOn(createAccountRepositoryStub, "create").mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );

    const accountData = makeFakeAccountData();
    const promise = sut.create(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("should return an account on succes", async () => {
    const { sut } = makeSut();
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const createdAccount = await sut.create(accountData);
    expect(createdAccount).toEqual(makeFakeAccount());
  });
});
