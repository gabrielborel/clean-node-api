import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentations/protocols";

export class LogControllerDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(request);
    if (response.statusCode === 500) {
      // !  log it !!
    }
    return response;
  }
}
