import { MongoHelper as sut } from "./mongo-helper";
import { test, describe, expect, beforeAll, afterAll } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("Mongo Helper", () => {
  beforeAll(async () => {
    const mongo = await MongoMemoryServer.create();
    await sut.connect(mongo.getUri());
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test("should reconnect if mongodb is down", async () => {
    let accountCollection = await sut.getCollection("accounts");
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    accountCollection = await sut.getCollection("accounts");
    expect(accountCollection).toBeTruthy();
  });
});
