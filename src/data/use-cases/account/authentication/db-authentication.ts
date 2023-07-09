import {
  Authentication,
  FindAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
  AuthenticationParams,
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(data: AuthenticationParams): Promise<string | null> {
    const account = await this.findAccountByEmailRepository.findByEmail(
      data.email
    );
    if (!account) {
      return null;
    }

    const passwordMatches = await this.hashComparer.compare(
      data.password,
      account.password
    );
    if (!passwordMatches) {
      return null;
    }

    const accessToken = await this.encrypter.encrypt(account.id);
    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken
    );

    return accessToken;
  }
}
