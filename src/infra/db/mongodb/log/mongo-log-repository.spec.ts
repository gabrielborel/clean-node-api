import { MongoHelper } from "../helpers/mongo-helper";
import { MongoLogRepository } from "./mongo-log-repository";
import { MongoMemoryServer } from "mongodb-memory-server";

const makeSut = (): MongoLogRepository => {
  return new MongoLogRepository();
};

let mongoServer: MongoMemoryServer;

describe("MongoDB Log Repository", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await MongoHelper.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    const errorCollection = await MongoHelper.getCollection("errors");
    await errorCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
    await mongoServer.stop();
  });

  test("should create an error log on success", async () => {
    const sut = makeSut();
    await sut.logError("any_error");
    const errorCollection = await MongoHelper.getCollection("errors");
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
