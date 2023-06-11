import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/use-cases/authentication";
import { FindAccountByEmailRepository } from "../../protocols/db/find-account-by-email-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository
  ) {}

  async auth(data: AuthenticationModel): Promise<string | null> {
    await this.findAccountByEmailRepository.find(data.email);
    return null;
  }
}
