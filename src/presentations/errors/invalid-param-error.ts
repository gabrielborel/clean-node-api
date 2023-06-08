export class InvalidParamError extends Error {
  constructor(paramName: string) {
    super(`"${paramName}" is invalid`);
    this.name = "InvalidParamError";
  }
}
