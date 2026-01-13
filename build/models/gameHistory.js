"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// GameHistory schema
const gameHistorySchema = new mongoose_1.default.Schema({
    playerOne: { type: String, required: true, minLength: 3 },
    playerTwo: { type: String, required: true, minLength: 3 },
    winnerName: { type: String, required: false },
    winningMark: { type: String, required: false },
    winningMove: { type: Number, required: false },
    status: { type: String, required: true },
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
