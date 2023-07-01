import { FindAccountByAccessToken } from "@/domain/use-cases/find-account-by-access-token";
import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { FindAccountByAccessTokenRepository } from "@/data/protocols/db/account/find-account-by-access-token-repository";
import { AccountModel } from "../create-account/db-create-account-protocols";

export class DbFindAccountByAccessToken implements FindAccountByAccessToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly findAccountByAccessTokenRepository: FindAccountByAccessTokenRepository
  ) {}

  async find(
    accessToken: string,
    role?: string | undefined
  ): Promise<AccountModel | null> {
    const decryptedAccessToken = await this.decrypter.decrypt(accessToken);
    if (!decryptedAccessToken) return null;

    const account =
      await this.findAccountByAccessTokenRepository.findByAccessToken(
        accessToken,
        role
      );
    if (!account) return null;

    return account;
  }
}
