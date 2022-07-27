"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
// TODO make a class with methods like 
// add(opts) - should add childs to the logger
// wrap up info/error etc
// unit tests
// assign logger to req.log?
const logger = (0, pino_1.default)({
    name: "ts-nodejs-template",
    timestamp: true,
}, process.stdout);
exports.default = logger;
