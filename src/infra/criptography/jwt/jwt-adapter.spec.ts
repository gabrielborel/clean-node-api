import { describe, expect, test, vi } from "vitest";
import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

vi.mock("jwt", () => ({
  default: {
    async sign(): Promise<string> {
      return "any_token";
    },
  },
}));

const makeSut = (): JwtAdapter => {
  return new JwtAdapter("secret");
};

describe("JWT Adapter", () => {
  test("should call sign with correct values", async () => {
    const sut = makeSut();
    const signSpy = vi.spyOn(jwt, "sign");
    await sut.encrypt("any_id");
    expect(signSpy).toHaveBeenCalledWith(
      {
        id: "any_id",
      },
      "secret"
    );
  });
});
