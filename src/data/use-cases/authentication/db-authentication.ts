import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/use-cases/authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { TokenGenerator } from "../../protocols/criptography/token-generator";
import { FindAccountByEmailRepository } from "../../protocols/db/find-account-by-email-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
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

    const accessToken = await this.tokenGenerator.generate(account.id);
    return accessToken;
  }
}
