import { InvalidParamError } from "@/presentations/errors";
import {
  Controller,
  FindSurveyById,
  HttpRequest,
  HttpResponse,
  forbidden,
  ok,
  serverError,
  SaveSurveyResult,
} from "./save-survey-result-protocols";

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly findSurveyById: FindSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = request;
      const { surveyId } = request.params;
      const { answer } = request.body;

      const survey = await this.findSurveyById.findById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError("surveyId"));
      }

      const surveyAnswers = survey.answers.map((a) => a.answer);
      const invalidAnswer = !surveyAnswers.includes(answer);
      if (invalidAnswer) {
        return forbidden(new InvalidParamError("answer"));
      }

      const surveyResult = await this.saveSurveyResult.save({
        accountId: accountId!,
        surveyId,
        answer,
        date: new Date(),
      });

      return ok(surveyResult);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
