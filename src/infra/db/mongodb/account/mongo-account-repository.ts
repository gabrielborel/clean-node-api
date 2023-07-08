import { ObjectId } from "mongodb";
import { CreateAccountRepository } from "@/data/protocols/db/account/create-account-repository";
import { FindAccountByEmailRepository } from "@/data/protocols/db/account/find-account-by-email-repository";
import { UpdateAccessTokenRepository } from "@/data/protocols/db/account/update-access-token-repository";
import { AccountModel } from "@/domain/models/account";
import { CreateAccountModel } from "@/domain/use-cases/account/create-account";
import { MongoHelper } from "../helpers/mongo-helper";
import { FindAccountByAccessTokenRepository } from "@/data/protocols/db/account/find-account-by-access-token-repository";

export class MongoAccountRepository
  implements
    CreateAccountRepository,
    FindAccountByEmailRepository,
    UpdateAccessTokenRepository,
    FindAccountByAccessTokenRepository
{
  async create(account: CreateAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(account);
    const createdAccount = await accountCollection.findOne({
      _id: result.insertedId,
    });
    if (!createdAccount) throw new Error("account not found");
    return MongoHelper.toDomain<AccountModel>(createdAccount);
  }

  async findByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne({ email });
    if (!account) return null;
    return MongoHelper.toDomain<AccountModel>(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          accessToken: token,
        },
      }
    );
  }

  async findByAccessToken(
    token: string,
    role?: string | undefined
  ): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{ role }, { role: "admin" }],
    });
    if (!account) return null;
    return MongoHelper.toDomain<AccountModel>(account);
  }
}
