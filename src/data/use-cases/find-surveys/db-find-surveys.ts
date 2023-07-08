import {
  FindSurveys,
  FindSurveysRepository,
  SurveyModel,
} from "./db-find-surveys-protocols";

export class DbFindSurveys implements FindSurveys {
  constructor(private readonly findSurveysRepository: FindSurveysRepository) {}

  async find(): Promise<SurveyModel[]> {
    return await this.findSurveysRepository.findAll();
  }
}
