import { NextFunction, Request, Response } from "express";
import { Middleware } from "../../presentations/protocols";

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest = {
      headers: req.headers,
    };
    const httpResponse = await middleware.handle(httpRequest);
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body);
      return next();
    }
    res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message,
    });
  };
};
