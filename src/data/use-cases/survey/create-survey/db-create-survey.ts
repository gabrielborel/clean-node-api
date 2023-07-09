import {
  CreateSurveyRepository,
  CreateSurvey,
  CreateSurveyParams,
} from "./db-create-survey-protocols";

export class DbCreateSurvey implements CreateSurvey {
  constructor(
    private readonly createSurveyRepository: CreateSurveyRepository
  ) {}

  async create(data: CreateSurveyParams): Promise<void> {
    await this.createSurveyRepository.create(data);
  }
}
