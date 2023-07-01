import { DbCreateSurvey } from "@/data/use-cases/create-survey/db-create-survey";
import { MongoSurveyRepository } from "@/infra/db/mongodb/survey/mongo-survey-repository";

export const makeDbCreateSurvey = (): DbCreateSurvey => {
  const surveyRepository = new MongoSurveyRepository();
  return new DbCreateSurvey(surveyRepository);
};
