import { EmailValidatorAdapter } from "./email-validator";

describe("EmailValidatorAdapter", () => {
  test("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.validate("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });
});
