"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server/server"));
const router_1 = __importDefault(require("./routes/router"));
const env = require('node-env-file');
const path = require('path');
env(path.resolve(__dirname + '/.env'));
require('./config/config');
const port = Number(process.env.PORT) || 0;
const server = server_1.default.init(port);
server.app.use(router_1.default);
// import MySQL from './mysql/mysql';
// MySQL.instance;
server.start(() => {
    console.log('Servidor corriendo en el puerto', port);
});
