"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../constants");
// GameHistory schema
const gameHistorySchema = new mongoose_1.default.Schema({
    playerOne: { type: String, required: true, match: constants_1.allowedChars, minLength: 3, maxLength: 20 },
    playerTwo: { type: String, required: true, match: constants_1.allowedChars, minLength: 3, maxLength: 20 },
    winnerName: { type: String, required: false, match: constants_1.allowedChars, minLength: 3, maxLength: 20 },
    winningMark: { type: String, required: false, enum: ["X", "O"] },
    // Game can not be won before turn 5
    winningMove: { type: Number, required: false, min: 5, max: 9 },
    status: { type: String, required: true, enum: [
            "aborted",
            "completed_with_winner",
            "completed_with_tie"
        ] },
});
// remove redundant ids from response
gameHistorySchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
const GameHistoryModel = mongoose_1.default.model("GameHistory", gameHistorySchema);
exports.default = GameHistoryModel;
