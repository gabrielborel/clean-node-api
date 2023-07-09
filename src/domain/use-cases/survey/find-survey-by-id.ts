import { SurveyModel } from "@/domain/models/survey";

export interface FindSurveyById {
  findById(id: string): Promise<SurveyModel | null>;
}
