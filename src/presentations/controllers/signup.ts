export class SignUpController {
  handle(request: any): any {
    if (request.body.name === "") {
      return {
        statusCode: 400,
        body: new Error("name is required"),
      };
    }
  }
}
