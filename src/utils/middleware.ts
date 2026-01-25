import { Request, Response, NextFunction } from "express";
import logger from "./logger.js";
import z, { ZodType } from "zod";

export const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

export const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  logger.error(error.message);

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  return response.status(500).json({ error: error.message });
};

export const validate = (schema: ZodType) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      return response.status(400).json({
        error: "Invalid request data",
        details: z.treeifyError(result.error)
      });
    }

    request.body = result.data;
    next();
  }
};