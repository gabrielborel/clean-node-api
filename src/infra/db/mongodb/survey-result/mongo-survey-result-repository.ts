import { SaveSurveyResultParams } from "@/domain/use-cases/survey-result/save-survey-result";
import { MongoHelper } from "../helpers/mongo-helper";
import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository";
import { SurveyResultModel } from "@/domain/models/survey-result";

export class MongoSurveyResultRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      "survey_results"
    );
    const res = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: data.surveyId,
        accountId: data.accountId,
      },
      {
        $set: {
          answer: data.answer,
          date: data.date,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );
    return MongoHelper.toDomain<SurveyResultModel>(res.value);
  }
}
