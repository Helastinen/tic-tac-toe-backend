import z from "zod";
import { allowedChars } from "../constants.js";
export const createGameHistorySchema = z.object({
    playerOne: z.string().trim().regex(allowedChars).min(3).max(20),
    playerTwo: z.string().trim().regex(allowedChars).min(3).max(20),
    winnerName: z.string().trim().regex(allowedChars).min(3).max(20).optional(),
    winningMark: z.enum(["X", "O"]).optional(),
    // Turn number. Game can not be won before turn 5
    winningMove: z.number().int().min(5).max(9).optional(),
    status: z.enum([
        "aborted",
        "completed_with_winner",
        "completed_with_tie"
    ]),
}).strict();
