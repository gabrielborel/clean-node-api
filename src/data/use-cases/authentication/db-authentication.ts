import {
  Authentication,
  FindAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
  AuthenticationModel,
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly Encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(data: AuthenticationModel): Promise<string | null> {
    const account = await this.findAccountByEmailRepository.find(data.email);
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

    const accessToken = await this.Encrypter.encrypt(account.id);
    await this.updateAccessTokenRepository.update(account.id, accessToken);

    return accessToken;
  }
}
