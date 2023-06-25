import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeCreateSurveyController } from "../factories/controllers/survey/create-survey/create-survey-controller-factory";
import { makeAuthMiddlware } from "../factories/middlewares/auth-middleware-factory";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeFindSurveysController } from "../factories/controllers/survey/find-surveys/find-surveys-controller-factory";

export default (router: Router) => {
  const adminAuth = adaptMiddleware(makeAuthMiddlware("admin"));
  const auth = adaptMiddleware(makeAuthMiddlware());

  router.post("/surveys", adminAuth, adaptRoute(makeCreateSurveyController()));
  router.get("/surveys", auth, adaptRoute(makeFindSurveysController()));
};
