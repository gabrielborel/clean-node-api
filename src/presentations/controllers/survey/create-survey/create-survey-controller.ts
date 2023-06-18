import { badRequest, ok } from "../../../helpers/http/http-helper";
import { Validation } from "../../../protocols/validation";
import {
  HttpRequest,
  Controller,
  HttpResponse,
  CreateSurvey,
} from "./create-survey-controller-protocols";

export class CreateSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createSurvey: CreateSurvey
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(request.body);
    if (error) {
      return badRequest(error);
    }

    const { question, answers } = request.body;
    await this.createSurvey.create({
      question,
      answers,
    });

    return ok({});
  }
}
