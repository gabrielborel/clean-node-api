import { CreateSurveyModel } from "../../../../domain/use-cases/create-survey";

export interface CreateSurveyRepository {
  create(data: CreateSurveyModel): Promise<void>;
}
