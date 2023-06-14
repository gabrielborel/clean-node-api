import { CreateAccountRepository } from "../../../../data/protocols/db/create-account-repository";
import { FindAccountByEmailRepository } from "../../../../data/protocols/db/find-account-by-email-repository";
import { AccountModel } from "../../../../domain/models/account";
import { CreateAccountModel } from "../../../../domain/use-cases/create-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class MongoAccountRepository
  implements CreateAccountRepository, FindAccountByEmailRepository
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
}
