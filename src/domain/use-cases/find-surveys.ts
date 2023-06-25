import { SurveyModel } from "../models/survey";

export interface FindSurveys {
  find(): Promise<SurveyModel[]>;
}
