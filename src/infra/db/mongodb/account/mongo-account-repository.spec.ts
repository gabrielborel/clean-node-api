import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoHelper } from "../helpers/mongo-helper";
import { MongoAccountRepository } from "./mongo-account-repository";
import {
  mockCreateAccountParams,
  mockCreateAccountParamsWithAccessToken,
  mockCreateAccountParamsWithAccessTokenAndAccessToken,
} from "@/domain/test";

const makeSut = (): MongoAccountRepository => {
  return new MongoAccountRepository();
};

let mongoServer: MongoMemoryServer;

describe("MongoDB Account Repository", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await MongoHelper.connect(uri);
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
    await mongoServer.stop();
  });

  test("should return an account on createAccount success", async () => {
    const sut = makeSut();
    const accountData = mockCreateAccountParams();
    const account = await sut.create(accountData);
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe(accountData.name);
    expect(account.email).toBe(accountData.email);
    expect(account.password).toBe(accountData.password);
  });

  test("should return an account on findByEmail success", async () => {
    const sut = makeSut();
    const accountData = mockCreateAccountParams();
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
    const accountData = mockCreateAccountParams();
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
    const accountData = mockCreateAccountParamsWithAccessToken();
    await sut.create(accountData);
    const account = await sut.findByAccessToken(accountData.accessToken);
    expect(account).toBeTruthy();
    expect(account!.id).toBeTruthy();
    expect(account!.name).toBe(accountData.name);
    expect(account!.email).toBe(accountData.email);
    expect(account!.password).toBe(accountData.password);
  });

  test("should return an account on findByAccessToken success, with admin role", async () => {
    const sut = makeSut();
    const accountData = mockCreateAccountParamsWithAccessTokenAndAccessToken();
    await sut.create(accountData);
    const account = await sut.findByAccessToken("any_token", "admin");
    expect(account).toBeTruthy();
    expect(account!.id).toBeTruthy();
    expect(account!.name).toBe(accountData.name);
    expect(account!.email).toBe(accountData.email);
    expect(account!.password).toBe(accountData.password);
  });

  test("should return null on findByAccessToken success, with invalid role", async () => {
    const sut = makeSut();
    const accountData = mockCreateAccountParamsWithAccessToken();
    await sut.create(accountData);
    const account = await sut.findByAccessToken("any_token", "admin");
    expect(account).toBeNull();
  });

  test("should return an account on findByAccessToken success if user is admin", async () => {
    const sut = makeSut();
    const accountData = mockCreateAccountParamsWithAccessTokenAndAccessToken();
    await sut.create(accountData);
    const account = await sut.findByAccessToken("any_token");
    expect(account).toBeTruthy();
    expect(account!.id).toBeTruthy();
    expect(account!.name).toBe(accountData.name);
    expect(account!.email).toBe(accountData.email);
    expect(account!.password).toBe(accountData.password);
  });

  test("should return null if findByAccessToken fails", async () => {
    const sut = makeSut();
    const account = await sut.findByEmail("valid_email@mail.com");
    expect(account).toBeNull();
  });
});
