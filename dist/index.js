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
var fs = require('fs');
var https = require('https');
// var express = require('express');
// const PORT = 5000;
// var app = express();
https
    .createServer({
    key: fs.readFileSync('dist/public/sadca.es_2020.key'),
    cert: fs.readFileSync('dist/public/sadca.es_2020.crt'),
}, server.app)
    .listen(port, function () {
    console.log('Servidor corriendo en el puerto ' + port + '...');
});
// server.app.get('/foo', function (req: any, res: any) {
//   console.log('Hello, I am foo.');
//   res.json({
//     ok: true,
//   });
// });
server.app.use(router_1.default);
// import fileUpload = require('express-fileupload');
// server.app.use(fileUpload());
// server.start(() => {
//   console.log('Servidor corriendo en el puerto', port);
// });
