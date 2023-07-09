import { CreateSurveyParams } from "@/domain/use-cases/survey/create-survey";
import { SurveyModel } from "@/domain/models/survey";
import { FindSurveysRepository } from "@/data/protocols/db/survey/find-surveys-repository";
import { CreateSurveyRepository } from "@/data/protocols/db/survey/create-survey-repository";
import { FindSurveyByIdRepository } from "@/data/protocols/db/survey/find-survey-by-id.repository";
import { mockSurveyModel, mockSurveyModels } from "@/domain/test";

export const mockCreateSurveyRepository = (): CreateSurveyRepository => {
  class CreateSurveyRepositoryStub implements CreateSurveyRepository {
    async create(data: CreateSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }
  return new CreateSurveyRepositoryStub();
};

export const mockFindSurveyByIdRepository = (): FindSurveyByIdRepository => {
  class FindSurveyByIdRepositoryStub implements FindSurveyByIdRepository {
    async findById(id: string): Promise<SurveyModel | null> {
      return Promise.resolve(mockSurveyModel());
    }
  }
  return new FindSurveyByIdRepositoryStub();
};

export const mockFindSurveysRepository = (): FindSurveysRepository => {
  class FindSurveysRepositoryStub implements FindSurveysRepository {
    async findAll(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModels());
    }
  }
  return new FindSurveysRepositoryStub();
};
