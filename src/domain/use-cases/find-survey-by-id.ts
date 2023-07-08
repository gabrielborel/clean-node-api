import { SurveyModel } from "../models/survey";

export interface FindSurveyById {
  findById(id: string): Promise<SurveyModel>;
}
