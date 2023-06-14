import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";
import { test, describe, vi, expect } from "vitest";

vi.mock("bcrypt", () => ({
  default: {
    async hash(): Promise<string> {
      return "hash";
    },
    async compare(): Promise<boolean> {
      return true;
    },
  },
}));

const SALT = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT);
};

describe("Bcrypt Adapter", () => {
  test("should call hash with correct values", async () => {
    const hashSpy = vi.spyOn(bcrypt, "hash");
    const sut = makeSut();
    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", SALT);
  });

  test("should return a valid hash on hash success", async () => {
    const sut = makeSut();
    const hash = await sut.hash("any_value");
    expect(hash).toBe("hash");
  });

  test("should throw if hash throws", async () => {
    const sut = makeSut();
    vi.spyOn(bcrypt, "hash").mockRejectedValueOnce(new Error());
    const promise = sut.hash("any_value");
    await expect(promise).rejects.toThrow();
  });

  test("should call compare with correct values", async () => {
    const compareSpy = vi.spyOn(bcrypt, "compare");
    const sut = makeSut();
    await sut.compare("any_value", "any_hash");
    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });

  test("should return true when compare succeeds", async () => {
    const sut = makeSut();
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBe(true);
  });

  test("should return false when compare fails", async () => {
    const sut = makeSut();
    // IDK why this type assert is needed
    vi.spyOn(bcrypt, "compare").mockResolvedValueOnce(false as unknown as void);
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBe(false);
  });
});
