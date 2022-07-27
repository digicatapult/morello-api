"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scenario = void 0;
const tsoa_1 = require("tsoa");
const child_process_1 = require("child_process");
const Logger_1 = __importDefault(require("../../utils/Logger"));
let log = Logger_1.default.child({ controller: '/scenario' });
let scenario = class scenario extends tsoa_1.Controller {
    get(id) {
        log.info(`executing ${id} scenario`);
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)("ls -la", (error, stdout, stderr) => {
                if (error)
                    reject({
                        status: 'error',
                        output: error,
                    });
                resolve({
                    status: stderr ? 'error' : 'success',
                    output: stderr ? stderr : stdout,
                });
            });
        });
    }
};
__decorate([
    (0, tsoa_1.Get)('{id}'),
    __param(0, (0, tsoa_1.Path)())
], scenario.prototype, "get", null);
scenario = __decorate([
    (0, tsoa_1.Route)('run')
], scenario);
exports.scenario = scenario;
