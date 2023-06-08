import { Encrypter } from "../../protocols/encrypter";
import { DbCreateAccount } from "./db-create-account";

describe("DbCreateAccount UseCase", () => {
  test("should call Encrypter with correct password", async () => {
    class EncrypterStub implements Encrypter {
      async encrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve("hashed_password"));
      }
    }

    const encrypterStub = new EncrypterStub();
    const sut = new DbCreateAccount(encrypterStub);
    const encrypterSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    await sut.create(accountData);
    expect(encrypterSpy).toHaveBeenCalledWith("valid_password");
  });
});
