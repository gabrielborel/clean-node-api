import { SurveyModel } from "@/domain/models/survey";

export interface FindSurveys {
  find(): Promise<SurveyModel[]>;
}
