import { DbSaveSurveyResult } from "@/data/use-cases/survey-result/save-survey-result/db-save-survey-result";
import { MongoSurveyResultRepository } from "@/infra/db/mongodb/survey-result/mongo-survey-result-repository";

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  return new DbSaveSurveyResult(new MongoSurveyResultRepository());
};
