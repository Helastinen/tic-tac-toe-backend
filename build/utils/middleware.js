"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.errorHandler = exports.unknownEndpoint = exports.requestLogger = void 0;
const logger_1 = __importDefault(require("./logger"));
const zod_1 = __importDefault(require("zod"));
const requestLogger = (request, response, next) => {
    logger_1.default.info("Method:", request.method);
    logger_1.default.info("Path:  ", request.path);
    logger_1.default.info("Body:  ", request.body);
    logger_1.default.info("---");
    next();
};
exports.requestLogger = requestLogger;
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};
exports.unknownEndpoint = unknownEndpoint;
const errorHandler = (error, request, response, next) => {
    logger_1.default.error(error.message);
    if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }
    return response.status(500).json({ error: error.message });
};
exports.errorHandler = errorHandler;
const validate = (schema) => {
    return (request, response, next) => {
        const result = schema.safeParse(request.body);
        if (!result.success) {
            return response.status(400).json({
                error: "Invalid request data",
                details: zod_1.default.treeifyError(result.error)
            });
        }
        request.body = result.data;
        next();
    };
};
exports.validate = validate;
