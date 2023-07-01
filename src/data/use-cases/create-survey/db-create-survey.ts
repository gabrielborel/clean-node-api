import {
  CreateSurveyRepository,
  CreateSurvey,
  CreateSurveyModel,
} from "./db-create-survey-protocols";

export class DbCreateSurvey implements CreateSurvey {
  constructor(
    private readonly createSurveyRepository: CreateSurveyRepository
  ) {}

  async create(data: CreateSurveyModel): Promise<void> {
    await this.createSurveyRepository.create(data);
  }
}
