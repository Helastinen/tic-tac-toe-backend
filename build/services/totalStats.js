"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateTotalStats = exports.defaultTotalStats = void 0;
const gameHistory_1 = __importDefault(require("../models/gameHistory"));
exports.defaultTotalStats = {
    playerOneWins: 0,
    playerTwoWins: 0,
    ties: 0,
    aborted: 0
};
const aggregateTotalStats = async () => {
    return gameHistory_1.default.aggregate([
        {
            $group: {
                _id: null,
                playerOneWins: {
                    $sum: {
                        $cond: [
                            { $eq: ["$winnerName", "$playerOne"] },
                            1,
                            0
                        ]
                    }
                },
                playerTwoWins: {
                    $sum: {
                        $cond: [
                            { $eq: ["$winnerName", "$playerTwo"] },
                            1,
                            0
                        ]
                    }
                },
                ties: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "completed_with_tie"] },
                            1,
                            0
                        ]
                    }
                },
                aborted: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "aborted"] },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                playerOneWins: 1,
                playerTwoWins: 1,
                ties: 1,
                aborted: 1
            }
        }
    ]);
};
exports.aggregateTotalStats = aggregateTotalStats;
