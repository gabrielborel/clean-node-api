import { describe, expect, test, vi } from "vitest";
import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

vi.mock("jsonwebtoken", () => ({
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

  test("should return a token on sign success", async () => {
    const sut = makeSut();
    const accessToken = await sut.encrypt("any_id");
    expect(accessToken).toBe("any_token");
  });

  test("should throw if sign throws", async () => {
    const sut = makeSut();
    vi.spyOn(jwt, "sign").mockRejectedValueOnce(new Error());
    const promise = sut.encrypt("any_id");
    await expect(promise).rejects.toThrow();
  });
});
