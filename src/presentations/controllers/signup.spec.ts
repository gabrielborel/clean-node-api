import { SignUpController } from "./signup";

describe("SignUp Controller", () => {
  test("should return 400 if no name is provided", () => {
    const sut = new SignUpController();
    const request = {
      body: {
        name: "",
        email: "any_email@mail.com",
        password: "any_password",
      },
    };
    const response = sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new Error("name is required"));
  });

  test("should return 400 if no email is provided", () => {
    const sut = new SignUpController();
    const request = {
      body: {
        name: "any_name",
        email: "",
        password: "any_password",
      },
    };
    const response = sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new Error("email is required"));
  });
});
