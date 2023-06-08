export class SignUpController {
  handle(request: any): any {
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
  }
}
