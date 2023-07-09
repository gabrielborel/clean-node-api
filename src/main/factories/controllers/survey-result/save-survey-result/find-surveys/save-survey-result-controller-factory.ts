import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller-decorator-factory";
import { makeDbSaveSurveyResult } from "@/main/factories/use-cases/survey-result/save-survey-result-factory";
import { makeDbFindSurveyById } from "@/main/factories/use-cases/survey/find-survey-by-id-factory";
import { SaveSurveyResultController } from "@/presentations/controllers/survey-result/save-survey-result/save-survey-result-controller";
import { Controller } from "@/presentations/protocols";

export const makeSaveSurveyResultController = (): Controller => {
  const dbFindSurveyByIdUseCase = makeDbFindSurveyById();
  const dbSaveSurveyResultUseCase = makeDbSaveSurveyResult();
  const controller = new SaveSurveyResultController(
    dbFindSurveyByIdUseCase,
    dbSaveSurveyResultUseCase
  );
  return makeLogControllerDecorator(controller);
};
