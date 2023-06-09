import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return "hash";
  },
}));

const SALT = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT);
};

describe("Bcrypt Adapter", () => {
  test("should call bcrypt with correct values", async () => {
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const sut = makeSut();
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", SALT);
  });

  test("should return a hash on success", async () => {
    const sut = makeSut();
    const hash = await sut.encrypt("any_value");
    expect(hash).toBe("hash");
  });

  test("should throw if bcrypt throws", async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, "hash")
      .mockReturnValueOnce(Promise.reject(new Error()) as unknown as void);
    const promise = sut.encrypt("any_value");
    await expect(promise).rejects.toThrow();
  });
});
