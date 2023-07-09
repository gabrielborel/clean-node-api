import { CreateSurveyModel } from "@/domain/use-cases/survey/create-survey";

export interface CreateSurveyRepository {
  create(data: CreateSurveyModel): Promise<void>;
}
