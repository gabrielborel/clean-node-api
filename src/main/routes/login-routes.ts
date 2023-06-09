import { Router } from "express";
import { adaptRoute } from "@/main/adapters/express-route-adapter";
import { makeSignUpController } from "@/main/factories/controllers/signup/signup-controller-factory";
import { makeSignInController } from "@/main/factories/controllers/signin/signin-controller-factory";

export default (router: Router) => {
  router.post("/signup", adaptRoute(makeSignUpController()));
  router.post("/signin", adaptRoute(makeSignInController()));
};
