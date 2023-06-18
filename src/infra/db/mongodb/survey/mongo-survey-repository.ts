import { CreateSurveyRepository } from "../../../../data/use-cases/create-survey/db-create-survey-protocols";
import { CreateSurveyModel } from "../../../../domain/use-cases/create-survey";
import { MongoHelper } from "../helpers/mongo-helper";

export class MongoSurveyRepository implements CreateSurveyRepository {
  async create(data: CreateSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(data);
  }
}
