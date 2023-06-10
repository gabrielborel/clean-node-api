import { Collection, MongoClient } from "mongodb";

export const MongoHelper = {
  client: null as unknown as MongoClient,
  url: null as unknown as string,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url, {});
    this.url = url;
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  async testConnection(): Promise<boolean> {
    try {
      await this.client.db().command({ ping: 1 });
      return true;
    } catch (error) {
      return false;
    }
  },

  async getCollection(name: string): Promise<Collection> {
    if (!(await this.testConnection())) await this.connect(this.url);
    return this.client.db().collection(name);
  },

  toDomain<T>(model: any): T {
    const { _id, ...obj } = model;
    return { id: _id.toString(), ...obj };
  },
};
