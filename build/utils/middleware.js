import logger from "./logger.js";
import z from "zod";
export const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method);
    logger.info("Path:  ", request.path);
    logger.info("Body:  ", request.body);
    logger.info("---");
    next();
};
export const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};
export const errorHandler = (error, request, response, next) => {
    logger.error(error.message);
    if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }
    return response.status(500).json({ error: error.message });
};
export const validate = (schema) => {
    return (request, response, next) => {
        const result = schema.safeParse(request.body);
        if (!result.success) {
            return response.status(400).json({
                error: "Invalid request data",
                details: z.treeifyError(result.error)
            });
        }
        request.body = result.data;
        next();
    };
};
