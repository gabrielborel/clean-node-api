import { SurveyModel } from "@/domain/models/survey";
import { FindSurveys } from "@/domain/use-cases/find-surveys";
import { FindSurveysRepository } from "@/data/protocols/db/survey/find-surveys-repository";

export class DbFindSurveys implements FindSurveys {
  constructor(private readonly findSurveysRepository: FindSurveysRepository) {}

  async find(): Promise<SurveyModel[]> {
    return await this.findSurveysRepository.findAll();
  }
}
