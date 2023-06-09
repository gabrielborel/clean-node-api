import { MongoHelper } from "../helpers/mongo-helper";
import { MongoAccountRepository } from "./account";

const makeSut = (): MongoAccountRepository => {
  return new MongoAccountRepository();
};

describe("MongoDB Account Repository", () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      console.log(process.env);
      await MongoHelper.connect(process.env.MONGO_URL);
    }
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("should return an account on success", async () => {
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
});
