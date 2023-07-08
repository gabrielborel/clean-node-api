import {
  AccountModel,
  Decrypter,
  FindAccountByAccessToken,
  FindAccountByAccessTokenRepository,
} from "./db-find-account-by-access-token-protocols";

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
