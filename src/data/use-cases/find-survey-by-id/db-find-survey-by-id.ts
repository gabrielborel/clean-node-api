import { FindSurveyByIdRepository } from "@/data/protocols/db/survey/find-survey-by-id.repository";
import { SurveyModel } from "@/domain/models/survey";
import { FindSurveyById } from "@/domain/use-cases/find-survey-by-id";

export class DbFindSurveyById implements FindSurveyById {
  constructor(
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}

  async findById(id: string): Promise<SurveyModel> {
    return await this.findSurveyByIdRepository.findById(id);
  }
}
