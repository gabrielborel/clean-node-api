import { FindSurveysRepository } from "../../../../data/protocols/db/survey/find-surveys-repository";
import { CreateSurveyRepository } from "../../../../data/use-cases/create-survey/db-create-survey-protocols";
import { SurveyModel } from "../../../../domain/models/survey";
import { CreateSurveyModel } from "../../../../domain/use-cases/create-survey";
import { MongoHelper } from "../helpers/mongo-helper";

export class MongoSurveyRepository
  implements CreateSurveyRepository, FindSurveysRepository
{
  async create(data: CreateSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.insertOne(data);
  }

  async findAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const surveys = await surveyCollection.find().toArray();
    return surveys.map((survey) => MongoHelper.toDomain<SurveyModel>(survey));
  }
}
