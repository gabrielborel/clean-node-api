import { CreateAccountRepository } from "../../../../data/protocols/create-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { CreateAccountModel } from "../../../../domain/use-cases/create-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class MongoAccountRepository implements CreateAccountRepository {
  async create(account: CreateAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(account);
    const createdAccount = await accountCollection.findOne({
      _id: result.insertedId,
    });
    if (!createdAccount) throw new Error("account not found");
    return MongoHelper.toDomain<AccountModel>(createdAccount);
  }
}
