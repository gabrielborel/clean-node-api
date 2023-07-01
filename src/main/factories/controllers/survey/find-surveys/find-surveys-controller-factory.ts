import { FindSurveysController } from "@/presentations/controllers/survey/find-surveys/find-surveys-controller";
import { Controller } from "@/presentations/protocols";
import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller-decorator-factory";
import { makeDbFindSurveys } from "@/main/factories/use-cases/survey/find-surveys-factory";

export const makeFindSurveysController = (): Controller => {
  const dbFindSurveysUseCase = makeDbFindSurveys();
  const controller = new FindSurveysController(dbFindSurveysUseCase);
  return makeLogControllerDecorator(controller);
};
