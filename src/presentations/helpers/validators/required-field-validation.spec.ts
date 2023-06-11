import { MissingParamError } from "../../errors";
import { RequiredFieldValidation } from "./required-field-validation";

const makeSut = (field: string): RequiredFieldValidation => {
  return new RequiredFieldValidation(field);
};

describe("RequiredField Validation", () => {
  test("should return an MissingParamError if validation fails", async () => {
    const sut = makeSut("email");
    const error = sut.validate({
      email: "",
    });
    expect(error).toEqual(new MissingParamError("email"));
  });

  test("should return nothing if validation succeeds", async () => {
    const sut = makeSut("email");
    const error = sut.validate({
      email: "any_email@mail.com",
    });
    expect(error).toBeNull();
  });
});
