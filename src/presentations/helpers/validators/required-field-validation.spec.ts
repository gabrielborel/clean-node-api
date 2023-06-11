import { MissingParamError } from "../../errors";
import { RequiredFieldValidation } from "./required-field-validation";

describe("RequiredField Validation", () => {
  test("should return an MissingParamError if validation fails", async () => {
    const sut = new RequiredFieldValidation("email");
    const error = sut.validate({
      email: "",
    });
    expect(error).toEqual(new MissingParamError("email"));
  });

  test("should return nothing if validation succeeds", async () => {
    const sut = new RequiredFieldValidation("email");
    const error = sut.validate({
      email: "any_email@mail.com",
    });
    expect(error).toBeNull();
  });
});
