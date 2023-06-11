import { MongoHelper } from "../helpers/mongo-helper";
import { MongoLogRepository } from "./log";

const makeSut = (): MongoLogRepository => {
  return new MongoLogRepository();
};

describe("MongoDB Log Repository", () => {
  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await MongoHelper.connect(process.env.MONGO_URL);
    }
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const errorCollection = await MongoHelper.getCollection("errors");
    await errorCollection.deleteMany({});
  });

  test("should create an error log on success", async () => {
    const sut = makeSut();
    await sut.logError("any_error");
    const errorCollection = await MongoHelper.getCollection("errors");
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
