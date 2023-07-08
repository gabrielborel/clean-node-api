import {
  Controller,
  FindSurveyById,
  HttpRequest,
  HttpResponse,
  ok,
} from "./save-survey-result-protocols";

export class SaveSurveyResultController implements Controller {
  constructor(private readonly findSurveyById: FindSurveyById) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = request.params;

    const survey = await this.findSurveyById.findById(surveyId);

    return ok(survey);
  }
}
