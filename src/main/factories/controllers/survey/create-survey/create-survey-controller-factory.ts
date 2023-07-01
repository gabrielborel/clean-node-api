import { CreateSurveyController } from "@/presentations/controllers/survey/create-survey/create-survey-controller";
import { Controller } from "@/presentations/protocols";
import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller-decorator-factory";
import { makeDbCreateSurvey } from "@/main/factories/use-cases/survey/create-survey-factory";
import { makeCreateSurveyValidation } from "./create-survey-validation-factory";

export const makeCreateSurveyController = (): Controller => {
  const validation = makeCreateSurveyValidation();
  const createSurvey = makeDbCreateSurvey();
  return makeLogControllerDecorator(
    new CreateSurveyController(validation, createSurvey)
  );
};
