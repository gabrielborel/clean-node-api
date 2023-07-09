import { SurveyModel } from "@/domain/models/survey";

export type CreateSurveyParams = Omit<SurveyModel, "id">;

export interface CreateSurvey {
  create(data: CreateSurveyParams): Promise<void>;
}
