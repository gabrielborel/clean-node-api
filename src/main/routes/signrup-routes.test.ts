import request from "supertest";
import { app } from "../config/app";

describe("SignUp Routes", () => {
  test("should return an account on success", async () => {
    const response = await request(app).post("/api/signup").send({
      name: "Any Name",
      email: "any_email@mail.com",
      password: "Any Password",
    });
    expect(response.status).toBe(200);
  });
});
