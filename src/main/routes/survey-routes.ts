import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeCreateSurveyController } from "../factories/controllers/survey/create-survey/create-survey-controller-factory";
import { makeAuthMiddlware } from "../factories/middlewares/auth-middleware-factory";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";

export default (router: Router) => {
  const adminAuth = adaptMiddleware(makeAuthMiddlware("admin"));
  router.post("/surveys", adminAuth, adaptRoute(makeCreateSurveyController()));
};
