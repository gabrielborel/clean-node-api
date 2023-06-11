import { MongoHelper } from "../helpers/mongo-helper";
import { MongoAccountRepository } from "./account";

const makeSut = (): MongoAccountRepository => {
  return new MongoAccountRepository();
};

describe("MongoDB Account Repository", () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await MongoHelper.connect(process.env.MONGO_URL);
    }
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
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
