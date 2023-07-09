import { mockSurveyResultModel } from "@/domain/test";
import { SaveSurveyResultRepository } from "@/data/use-cases/survey-result/save-survey-result/db-save-survey-result-protocols";
import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultParams } from "@/domain/use-cases/survey-result/save-survey-result";

export const mockSaveSurveyResultRepository =
  (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        return Promise.resolve(mockSurveyResultModel());
      }
    }
    return new SaveSurveyResultRepositoryStub();
  };
