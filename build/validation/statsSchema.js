"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGameHistorySchema = void 0;
const zod_1 = __importDefault(require("zod"));
const constants_1 = require("../constants");
exports.createGameHistorySchema = zod_1.default.object({
    playerOne: zod_1.default.string().trim().regex(constants_1.allowedChars).min(3).max(20),
    playerTwo: zod_1.default.string().trim().regex(constants_1.allowedChars).min(3).max(20),
    winnerName: zod_1.default.string().trim().regex(constants_1.allowedChars).min(3).max(20).optional(),
    winningMark: zod_1.default.enum(["X", "O"]).optional(),
    // Turn number. Game can not be won before turn 5
    winningMove: zod_1.default.number().int().min(5).max(9).optional(),
    status: zod_1.default.enum([
        "aborted",
        "completed_with_winner",
        "completed_with_tie"
    ]),
}).strict();
