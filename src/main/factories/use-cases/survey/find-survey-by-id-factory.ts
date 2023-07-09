import { DbFindSurveyById } from "@/data/use-cases/survey/find-survey-by-id/db-find-survey-by-id";
import { MongoSurveyRepository } from "@/infra/db/mongodb/survey/mongo-survey-repository";

export const makeDbFindSurveyById = (): DbFindSurveyById => {
  return new DbFindSurveyById(new MongoSurveyRepository());
};
