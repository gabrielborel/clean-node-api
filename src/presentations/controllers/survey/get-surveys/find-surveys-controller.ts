import { ok, serverError } from "../../../helpers/http/http-helper";
import {
  Controller,
  FindSurveys,
  HttpRequest,
  HttpResponse,
} from "./find-surveys-controller-protocols";

export class FindSurveysController implements Controller {
  constructor(private readonly findSurveys: FindSurveys) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.findSurveys.find();
      return ok(surveys);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
