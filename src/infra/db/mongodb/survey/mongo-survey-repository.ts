import { FindSurveysRepository } from "@/data/protocols/db/survey/find-surveys-repository";
import { CreateSurveyRepository } from "@/data/use-cases/create-survey/db-create-survey-protocols";
import { FindSurveyByIdRepository } from "@/data/use-cases/find-survey-by-id/db-find-survey-by-id-protocols";
import { SurveyModel } from "@/domain/models/survey";
import { CreateSurveyModel } from "@/domain/use-cases/create-survey";
import { MongoHelper } from "../helpers/mongo-helper";
import { ObjectId } from "mongodb";

export class MongoSurveyRepository
  implements
    CreateSurveyRepository,
    FindSurveysRepository,
    FindSurveyByIdRepository
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

  async findById(id: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection("surveys");
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) });
    if (!survey) return null;
    return MongoHelper.toDomain<SurveyModel>(survey);
  }
}
