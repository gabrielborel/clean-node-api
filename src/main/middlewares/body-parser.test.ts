import request from "supertest";
import { app } from "../config/app";
import { test, describe } from "vitest";

describe("Body Parser Middleware", () => {
  test("should parse body as json", async () => {
    app.post("/test_body_parser", (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .post("/test_body_parser")
      .send({ name: "Any name" })
      .expect({ name: "Any name" });
  });
});
