export class ServerError extends Error {
  constructor(stackTrace: string | undefined) {
    super("Internal server error");
    this.name = "ServerError";
    this.stack = stackTrace;
  }
}
