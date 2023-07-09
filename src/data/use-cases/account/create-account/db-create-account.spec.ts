import { mockCreateAccountRepository, mockHasher } from "@/data/test";
import { DbCreateAccount } from "./db-create-account";
import {
  AccountModel,
  CreateAccountParams,
  CreateAccountRepository,
  FindAccountByEmailRepository,
  Hasher,
} from "./db-create-account-protocols";
import { mockAccountModel, mockCreateAccountParams } from "@/domain/test";

const mockFindAccountByEmailRepository = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub
    implements FindAccountByEmailRepository
  {
    async findByEmail(email: string): Promise<AccountModel | null> {
      return Promise.resolve(null);
    }
  }
  return new FindAccountByEmailRepositoryStub();
};

type SutType = {
  sut: DbCreateAccount;
  hasherStub: Hasher;
  createAccountRepositoryStub: CreateAccountRepository;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
};

const makeSut = (): SutType => {
  const hasherStub = mockHasher();
  const createAccountRepositoryStub = mockCreateAccountRepository();
  const findAccountByEmailRepositoryStub = mockFindAccountByEmailRepository();
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
    const hasherSpy = jest.spyOn(hasherStub, "hash");
    const accountData = mockCreateAccountParams();
    await sut.create(accountData);
    expect(hasherSpy).toHaveBeenCalledWith("any_password");
  });

  test("should throw if Hasher throws", async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, "hash").mockRejectedValueOnce(new Error());
    const accountData = mockCreateAccountParams();
    const promise = sut.create(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("should call CreateAccountRepository with correct data", async () => {
    const { sut, createAccountRepositoryStub } = makeSut();
    const createSpy = jest.spyOn(createAccountRepositoryStub, "create");
    const accountData = mockCreateAccountParams();
    await sut.create(accountData);
    expect(createSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "hashed_password",
    });
  });

  test("should throw if CreateAccountRepository throws", async () => {
    const { sut, createAccountRepositoryStub } = makeSut();
    jest
      .spyOn(createAccountRepositoryStub, "create")
      .mockRejectedValueOnce(new Error());
    const accountData = mockCreateAccountParams();
    const promise = sut.create(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("should return an account on succes", async () => {
    const { sut } = makeSut();
    const accountData = {
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    };
    const createdAccount = await sut.create(accountData);
    expect(createdAccount).toEqual(mockAccountModel());
  });

  test("should call FindAccountByEmailRepository with correct values", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(findAccountByEmailRepositoryStub, "findByEmail");
    await sut.create(mockCreateAccountParams());
    expect(findSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("should return null if FindAccountByEmailRepository returns an account", async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(findAccountByEmailRepositoryStub, "findByEmail")
      .mockResolvedValueOnce(mockAccountModel());
    const accountData = mockCreateAccountParams();
    const createdAccount = await sut.create(accountData);
    expect(createdAccount).toBeNull();
  });
});
