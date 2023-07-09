import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return "hash";
  },
  async compare(): Promise<boolean> {
    return true;
  },
}));

const SALT = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT);
};

describe("Bcrypt Adapter", () => {
  test("should call hash with correct values", async () => {
    const hashSpy = jest.spyOn(bcrypt, "hash");
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
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(() => Promise.reject(new Error()));
    const promise = sut.hash("any_value");
    await expect(promise).rejects.toThrow();
  });

  test("should call compare with correct values", async () => {
    const compareSpy = jest.spyOn(bcrypt, "compare");
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
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(() => Promise.resolve(false));
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBe(false);
  });

  test("should throw if compare throws", async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(() => Promise.reject(new Error()));
    const promise = sut.compare("any_value", "any_hash");
    await expect(promise).rejects.toThrow();
  });
});
