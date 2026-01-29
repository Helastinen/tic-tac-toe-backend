"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameHistoryLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.gameHistoryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 1000,
    max: 5, // max 5 requests per window per IP
    message: { error: "Too many requests, please slow down" },
    standardHeaders: true, // adds RateLimit-* headers 
    legacyHeaders: false
});
