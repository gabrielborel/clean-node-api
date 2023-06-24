import { FindAccountByAccessToken } from "../../../domain/use-cases/find-account-by-access-token";
import { Decrypter } from "../../protocols/criptography/decrypter";
import { FindAccountByAccessTokenRepository } from "../../protocols/db/account/find-account-by-access-token-repository";
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

    await this.findAccountByAccessTokenRepository.findByAccessToken(
      accessToken,
      role
    );
    return null;
  }
}
