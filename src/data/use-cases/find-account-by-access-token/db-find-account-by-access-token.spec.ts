import { describe, test, vi, expect } from "vitest";
import { Decrypter } from "../../protocols/criptography/decrypter";
import { DbFindAccountByAccessToken } from "./db-find-account-by-access-token";

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string | null> {
      return "haha";
    }
  }
  return new DecrypterStub();
};

interface SutType {
  sut: DbFindAccountByAccessToken;
  decrypterStub: Decrypter;
}

const makeSut = (): SutType => {
  const decrypter = makeDecrypterStub();
  const sut = new DbFindAccountByAccessToken(decrypter);
  return { sut, decrypterStub: decrypter };
};

describe("DbFindAccountByAccessToken Use Case", () => {
  test("should call Decrypter with correct values", async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = vi.spyOn(decrypterStub, "decrypt");
    await sut.find("any_token", "any_role");
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });

  test("should return null if Decrypter returns null", async () => {
    const { sut, decrypterStub } = makeSut();
    vi.spyOn(decrypterStub, "decrypt").mockReturnValueOnce(
      new Promise((resolve) => resolve(null))
    );
    const account = await sut.find("any_token");
    expect(account).toBeNull();
  });
});
