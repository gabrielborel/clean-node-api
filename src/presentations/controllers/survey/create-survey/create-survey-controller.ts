import { ok } from "../../../helpers/http/http-helper";
import { Validation } from "../../../protocols/validation";
import {
  HttpRequest,
  Controller,
  HttpResponse,
} from "./create-survey-controller-protocols";

export class CreateSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(request.body);
    return ok({});
  }
}
