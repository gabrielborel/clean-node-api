import { CreateSurveyParams } from "@/domain/use-cases/survey/create-survey";

export interface CreateSurveyRepository {
  create(data: CreateSurveyParams): Promise<void>;
}
