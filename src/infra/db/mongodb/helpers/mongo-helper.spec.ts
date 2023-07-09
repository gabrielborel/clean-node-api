import { MongoHelper as sut } from "./mongo-helper";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

describe("Mongo Helper", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await sut.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await sut.disconnect();
    await mongoServer.stop();
  });

  test("should reconnect if mongodb is down", async () => {
    let accountCollection = await sut.getCollection("accounts");
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    accountCollection = await sut.getCollection("accounts");
    expect(accountCollection).toBeTruthy();
  });
});
