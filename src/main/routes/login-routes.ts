import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeSignUpController } from "../factories/signup/signup-factory";
import { makeSignInController } from "../factories/signin/signin-factory";

export default (router: Router) => {
  router.post("/signup", adaptRoute(makeSignUpController()));
  router.post("/signin", adaptRoute(makeSignInController()));
};
