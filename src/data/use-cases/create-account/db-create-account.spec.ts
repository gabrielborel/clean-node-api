import { DbCreateAccount } from "./db-create-account";
import {
  AccountModel,
  CreateAccountModel,
  CreateAccountRepository,
  Encrypter,
} from "./db-create-account-protocols";

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncrypterStub();
};

const makeCreateAccountRepository = (): CreateAccountRepository => {
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create(account: CreateAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email",
        password: "hashed_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new CreateAccountRepositoryStub();
};

interface SutType {
  sut: DbCreateAccount;
  encrypterStub: Encrypter;
  createAccountRepositoryStub: CreateAccountRepository;
}

const makeSut = (): SutType => {
  const encrypterStub = makeEncrypter();
  const createAccountRepositoryStub = makeCreateAccountRepository();
  const sut = new DbCreateAccount(encrypterStub, createAccountRepositoryStub);
  return { sut, encrypterStub, createAccountRepositoryStub };
};

describe("DbCreateAccount UseCase", () => {
  test("should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();
    const encrypterSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    await sut.create(accountData);
    expect(encrypterSpy).toHaveBeenCalledWith("valid_password");
  });

  test("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const promise = sut.create(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("should call CreateAccountRepository with correct data", async () => {
    const { sut, createAccountRepositoryStub } = makeSut();
    const createSpy = jest.spyOn(createAccountRepositoryStub, "create");
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    await sut.create(accountData);
    expect(createSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password",
    });
  });

  test("should throw if CreateAccountRepository throws", async () => {
    const { sut, createAccountRepositoryStub } = makeSut();
    jest
      .spyOn(createAccountRepositoryStub, "create")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
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
    expect(createdAccount).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });
});
