import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/use-cases/authentication";
import { FindAccountByEmailRepository } from "../../protocols/find-account-by-email-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository
  ) {}

  async auth(data: AuthenticationModel): Promise<string> {
    await this.findAccountByEmailRepository.find(data.email);
    return "access_token";
  }
}
