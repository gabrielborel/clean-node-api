import { InvalidParamError } from "@/presentations/errors";
import {
  Controller,
  FindSurveyById,
  HttpRequest,
  HttpResponse,
  forbidden,
  ok,
  serverError,
} from "./save-survey-result-protocols";

export class SaveSurveyResultController implements Controller {
  constructor(private readonly findSurveyById: FindSurveyById) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId, answer } = request.params;

      const survey = await this.findSurveyById.findById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError("surveyId"));
      }

      const surveyAnswers = survey.answers.map((a) => a.answer);
      const invalidAnswer = !surveyAnswers.includes(answer);
      if (invalidAnswer) {
        return forbidden(new InvalidParamError("answer"));
      }

      return ok(survey);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
