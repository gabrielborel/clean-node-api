import { InvalidParamError } from "@/presentations/errors";
import {
  Controller,
  FindSurveyById,
  HttpRequest,
  HttpResponse,
  forbidden,
  ok,
} from "./save-survey-result-protocols";

export class SaveSurveyResultController implements Controller {
  constructor(private readonly findSurveyById: FindSurveyById) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = request.params;

    const survey = await this.findSurveyById.findById(surveyId);
    if (!survey) {
      return forbidden(new InvalidParamError("surveyId"));
    }

    return ok(survey);
  }
}
