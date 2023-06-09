import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentations/protocols";

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(request);
    if (response.statusCode === 500) {
      await this.logErrorRepository.logError(response.body.stack);
    }
    return response;
  }
}
