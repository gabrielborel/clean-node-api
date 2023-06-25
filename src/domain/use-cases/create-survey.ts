import { SurveyAnswerModel } from "../models/survey";

export interface CreateSurveyModel {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}

export interface CreateSurvey {
  create(data: CreateSurveyModel): Promise<void>;
}
