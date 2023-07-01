import { SurveyModel } from "@/domain/models/survey";

export type CreateSurveyModel = Omit<SurveyModel, "id">;

export interface CreateSurvey {
  create(data: CreateSurveyModel): Promise<void>;
}
