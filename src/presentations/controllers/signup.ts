import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  handle(request: HttpRequest): HttpResponse {
    if (!request.body.name) {
      return {
        statusCode: 400,
        body: new Error("name is required"),
      };
    }

    if (!request.body.email) {
      return {
        statusCode: 400,
        body: new Error("email is required"),
      };
    }

    return {
      statusCode: 201,
      body: {},
    };
  }
}
