import { Router } from "express";
import { adaptRoute } from "@/main/adapters/express-route-adapter";
import { makeCreateSurveyController } from "@/main/factories/controllers/survey/create-survey/create-survey-controller-factory";
import { makeAuthMiddlware } from "@/main/factories/middlewares/auth-middleware-factory";
import { adaptMiddleware } from "@/main/adapters/express-middleware-adapter";
import { makeFindSurveysController } from "@/main/factories/controllers/survey/find-surveys/find-surveys-controller-factory";

export default (router: Router) => {
  const adminAuth = adaptMiddleware(makeAuthMiddlware("admin"));
  const auth = adaptMiddleware(makeAuthMiddlware());

  router.post("/surveys", adminAuth, adaptRoute(makeCreateSurveyController()));
  router.get("/surveys", auth, adaptRoute(makeFindSurveysController()));
};
