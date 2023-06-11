import { Validation } from "../../protocols/validation";

export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}

  validate(data: any): Error | null {
    for (const validation of this.validations) {
      const error = validation.validate(data);
      if (error) {
        return error;
      }
    }
    return null;
  }
}
