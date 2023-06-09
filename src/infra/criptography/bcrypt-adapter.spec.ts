import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return "hash";
  },
}));

describe("Bcrypt Adapter", () => {
  test("should call bcrypt with correct values", async () => {
    const hashSpy = jest.spyOn(bcrypt, "hash");
    const SALT = 12;
    const sut = new BcryptAdapter(SALT);
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", SALT);
  });

  test("should return a hash on success", async () => {
    const SALT = 12;
    const sut = new BcryptAdapter(SALT);
    const hash = await sut.encrypt("any_value");
    expect(hash).toBe("hash");
  });
});
