import { FindAccountByAccessToken } from "../../../domain/use-cases/find-account-by-access-token";
import { Decrypter } from "../../protocols/criptography/decrypter";
import { AccountModel } from "../create-account/db-create-account-protocols";

export class DbFindAccountByAccessToken implements FindAccountByAccessToken {
  constructor(private readonly decrypter: Decrypter) {}

  async find(
    accessToken: string,
    role?: string | undefined
  ): Promise<AccountModel | null> {
    await this.decrypter.decrypt(accessToken);
    return null;
  }
}
