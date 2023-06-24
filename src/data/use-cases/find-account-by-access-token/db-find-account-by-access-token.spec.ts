import { describe, test, vi, expect } from "vitest";
import { Decrypter } from "../../protocols/criptography/decrypter";
import { DbFindAccountByAccessToken } from "./db-find-account-by-access-token";

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
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
    await sut.find("any_token");
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });
});
