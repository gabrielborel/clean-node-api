import {
  FindSurveyById,
  FindSurveyByIdRepository,
  SurveyModel,
} from "./db-find-survey-by-id-protocols";

export class DbFindSurveyById implements FindSurveyById {
  constructor(
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}

  async findById(id: string): Promise<SurveyModel> {
    return await this.findSurveyByIdRepository.findById(id);
  }
}
