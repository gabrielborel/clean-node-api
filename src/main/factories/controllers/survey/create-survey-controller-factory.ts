import { CreateSurveyController } from "../../../../presentations/controllers/survey/create-survey/create-survey-controller";
import { Controller } from "../../../../presentations/protocols";
import { makeLogControllerDecorator } from "../../decorators/log-controller-decorator-factory";
import { makeDbCreateSurvey } from "../../use-cases/survey/create-survey-factory";
import { makeCreateSurveyValidation } from "./create-survey-validation-factory";

export const makeCreateSurveyController = (): Controller => {
  const validation = makeCreateSurveyValidation();
  const createSurvey = makeDbCreateSurvey();
  return makeLogControllerDecorator(
    new CreateSurveyController(validation, createSurvey)
  );
};
