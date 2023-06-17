export class ParamAlreadyInUseError extends Error {
  constructor(paramName: string) {
    super(`the received parameter: "${paramName}" is already in use`);
    this.name = "ParamAlreadyInUseError";
  }
}
