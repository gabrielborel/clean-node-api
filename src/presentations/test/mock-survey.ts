import { mockSurveyModel, mockSurveyModels } from "@/domain/test";
import { FindSurveys } from "@/domain/use-cases/survey/find-surveys";
import { SurveyModel } from "@/domain/models/survey";
import {
  CreateSurvey,
  CreateSurveyParams,
} from "@/domain/use-cases/survey/create-survey";
import { FindSurveyById } from "@/domain/use-cases/survey/find-survey-by-id";

export const mockFindSurveys = (): FindSurveys => {
  class FindSurveysStub {
    async find(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModels());
    }
  }
  return new FindSurveysStub();
};

export const mockCreateSurvey = (): CreateSurvey => {
  class CreateSurveyStub implements CreateSurvey {
    async create(data: CreateSurveyParams): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new CreateSurveyStub();
};

export const mockFindSurveyById = (): FindSurveyById => {
  class FindSurveyByIdStub implements FindSurveyById {
    async findById(id: string): Promise<SurveyModel | null> {
      return Promise.resolve(mockSurveyModel());
    }
  }
  return new FindSurveyByIdStub();
};
