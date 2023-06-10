import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url, {});
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  toDomain<T>(model: any): T {
    const { _id, ...obj } = model;
    return { id: _id.toString(), ...obj };
  },
};
