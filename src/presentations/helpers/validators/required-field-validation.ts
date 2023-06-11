import { MissingParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate(data: any): Error | null {
    if (!data[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
    return null;
  }
}
