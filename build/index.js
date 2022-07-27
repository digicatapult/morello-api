"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const body_parser_1 = require("body-parser");
const swaggerUI = __importStar(require("swagger-ui-express"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const swaggerJson = __importStar(require("./swagger.json"));
const Logger_1 = __importDefault(require("./utils/Logger"));
const app = (0, express_1.default)();
const port = config_1.default.get('app.port');
let log = Logger_1.default.child({ example: "child-example" });
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.use((0, body_parser_1.json)());
(0, routes_1.RegisterRoutes)(app);
app.use(['/openapi', '/docs', '/swagger'], swaggerUI.serve, swaggerUI.setup(swaggerJson));
app.listen(port, () => {
    log.info('Server is running');
});
