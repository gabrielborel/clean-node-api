import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeCreateSurveyController } from "../factories/controllers/survey/create-survey-controller-factory";

export default (router: Router) => {
  router.post("/surveys", adaptRoute(makeCreateSurveyController()));
};
