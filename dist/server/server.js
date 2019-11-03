"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
class Server {
    constructor(puerto) {
        this.port = puerto;
        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(fileUpload({ useTempFiles: true }));
    }
    static init(puerto) {
        return new Server(puerto);
    }
    start(callback) {
        this.app.listen(this.port, callback);
    }
}
exports.default = Server;
