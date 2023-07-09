import { mockSurveyResultModel } from "@/domain/test";
import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from "@/domain/use-cases/survey-result/save-survey-result";
import { SurveyResultModel } from "@/domain/models/survey-result";

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel());
    }
  }
  return new SaveSurveyResultStub();
};
