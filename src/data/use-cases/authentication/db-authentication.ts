import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/use-cases/authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { FindAccountByEmailRepository } from "../../protocols/db/find-account-by-email-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth(data: AuthenticationModel): Promise<string | null> {
    const account = await this.findAccountByEmailRepository.find(data.email);
    if (!account) {
      return null;
    }
    await this.hashComparer.compare(data.password, account.password);
    return null;
  }
}
