import { ok } from "../../../helpers/http/http-helper";
import {
  Controller,
  FindSurveys,
  HttpRequest,
  HttpResponse,
} from "./find-surveys-controller-protocols";

export class FindSurveysController implements Controller {
  constructor(private readonly findSurveys: FindSurveys) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    await this.findSurveys.find();
    return ok({});
  }
}
