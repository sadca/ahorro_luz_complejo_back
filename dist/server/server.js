"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const timeout = require("connect-timeout");
// import busboy = require('connect-busboy');
class Server {
    constructor(puerto) {
        this.port = puerto;
        this.app = express();
        this.app.use(timeout('3000s'));
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(fileUpload());
        // this.app.use(busboy());
    }
    static init(puerto) {
        return new Server(puerto);
    }
    start(callback) {
        this.app.listen(this.port, callback);
    }
}
exports.default = Server;
