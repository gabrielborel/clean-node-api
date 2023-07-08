import {
  badRequest,
  noContent,
  serverError,
} from "../../../helpers/http/http-helper";
import { Validation } from "../../../protocols/validation";
import {
  Controller,
  CreateSurvey,
  HttpRequest,
  HttpResponse,
} from "./create-survey-controller-protocols";

export class CreateSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly createSurvey: CreateSurvey
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body);
      if (error) {
        return badRequest(error);
      }

      const { question, answers } = request.body;
      await this.createSurvey.create({
        question,
        answers,
        date: new Date(),
      });

      return noContent();
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
