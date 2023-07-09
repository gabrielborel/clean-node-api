import { adaptMiddleware } from "@/main/adapters/express-middleware-adapter";
import { adaptRoute } from "@/main/adapters/express-route-adapter";
import { makeAuthMiddlware } from "@/main/factories/middlewares/auth-middleware-factory";
import { Router } from "express";
import { makeSaveSurveyResultController } from "../factories/controllers/survey-result/save-survey-result/find-surveys/save-survey-result-controller-factory";

export default (router: Router) => {
  const auth = adaptMiddleware(makeAuthMiddlware());

  router.put(
    "/surveys/:surveyId/results",
    auth,
    adaptRoute(makeSaveSurveyResultController())
  );
};
