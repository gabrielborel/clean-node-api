import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";
import { test, describe, vi, expect } from "vitest";

vi.mock("bcrypt", () => ({
  default: {
    async hash(): Promise<string> {
      return "hash";
    },
  },
}));

const SALT = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT);
};

describe("Bcrypt Adapter", () => {
  test("should call bcrypt with correct values", async () => {
    const hashSpy = vi.spyOn(bcrypt, "hash");
    const sut = makeSut();
    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", SALT);
  });

  test("should return a hash on success", async () => {
    const sut = makeSut();
    const hash = await sut.hash("any_value");
    expect(hash).toBe("hash");
  });

  test("should throw if bcrypt throws", async () => {
    const sut = makeSut();
    vi.spyOn(bcrypt, "hash").mockRejectedValueOnce(new Error());
    const promise = sut.hash("any_value");
    await expect(promise).rejects.toThrow();
  });
});
