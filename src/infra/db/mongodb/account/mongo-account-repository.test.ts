import {
  test,
  describe,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoHelper } from "../helpers/mongo-helper";
import { MongoAccountRepository } from "./mongo-account-repository";

const makeSut = (): MongoAccountRepository => {
  return new MongoAccountRepository();
};

describe.only("MongoDB Account Repository", () => {
  beforeAll(async () => {
    const mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await MongoHelper.connect(uri);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  test("should return an account on createAccount success", async () => {
    const sut = makeSut();
    const accountData = {
      name: "any_name",
      email: "valid_email@mail.com",
      password: "any_password",
    };
    const account = await sut.create(accountData);
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe(accountData.name);
    expect(account.email).toBe(accountData.email);
    expect(account.password).toBe(accountData.password);
  });

  test("should return an account on findByEmail success", async () => {
    const sut = makeSut();
    const accountData = {
      name: "any_name",
      email: "valid_email@mail.com",
      password: "any_password",
    };
    await sut.create(accountData);
    const account = await sut.findByEmail(accountData.email);
    expect(account).toBeTruthy();
    expect(account!.id).toBeTruthy();
    expect(account!.name).toBe(accountData.name);
    expect(account!.email).toBe(accountData.email);
    expect(account!.password).toBe(accountData.password);
  });

  test("should return null if loadByEmail fails", async () => {
    const sut = makeSut();
    const account = await sut.findByEmail("valid_email@mail.com");
    expect(account).toBeNull();
  });

  test("should update the account accessToken on updateAccessToken success", async () => {
    const sut = makeSut();
    const accountData = {
      name: "any_name",
      email: "valid_email@mail.com",
      password: "any_password",
    };
    const { id } = await sut.create(accountData);
    expect(id).toBeTruthy();
    let account = await sut.findByEmail(accountData.email);
    expect(account).toBeTruthy();
    expect(account!.accessToken).toBeFalsy();
    await sut.updateAccessToken(id, "any_token");
    account = await sut.findByEmail(accountData.email);
    expect(account).toBeTruthy();
    expect(account!.accessToken).toBe("any_token");
  });

  test("should return an account on findByAccessToken success, without role", async () => {
    const sut = makeSut();
    const accountData = {
      name: "any_name",
      email: "valid_email@mail.com",
      password: "any_password",
      accessToken: "any_token",
    };
    await sut.create(accountData);
    const account = await sut.findByAccessToken(accountData.accessToken);
    expect(account).toBeTruthy();
    expect(account!.id).toBeTruthy();
    expect(account!.name).toBe(accountData.name);
    expect(account!.email).toBe(accountData.email);
    expect(account!.password).toBe(accountData.password);
  });
});
