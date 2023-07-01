import { DbFindSurveys } from "@/data/use-cases/find-surveys/db-find-surveys";
import { MongoSurveyRepository } from "@/infra/db/mongodb/survey/mongo-survey-repository";

export const makeDbFindSurveys = (): DbFindSurveys => {
  return new DbFindSurveys(new MongoSurveyRepository());
};
