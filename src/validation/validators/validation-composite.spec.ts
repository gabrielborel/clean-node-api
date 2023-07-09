import { MissingParamError } from "@/presentations/errors";
import { Validation } from "@/presentations/protocols/validation";
import { ValidationComposite } from "./validation-composite";
import { mockValidation } from "../test";

type SutType = {
  sut: ValidationComposite;
  validationStubs: Validation[];
};

const makeSut = (): SutType => {
  const validationStubs = [mockValidation(), mockValidation()];
  const sut = new ValidationComposite(validationStubs);
  return {
    sut,
    validationStubs,
  };
};

describe("Validation Composite", () => {
  test("should return an error if any validation fails", async () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], "validate")
      .mockReturnValueOnce(new MissingParamError("email"));
    const error = sut.validate({
      email: "any_email@mail.com",
    });
    expect(error).toEqual(new MissingParamError("email"));
  });

  test("should return the first error if more than one validation fails", async () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("email"));
    const error = sut.validate({
      email: "any_email@mail.com",
    });
    expect(error).toEqual(new Error());
  });

  test("should return nothing if validation succeeds", async () => {
    const { sut } = makeSut();
    const error = sut.validate({
      email: "any_email@mail.com",
    });
    expect(error).toBeNull();
  });
});
