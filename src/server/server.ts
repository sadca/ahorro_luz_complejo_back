import express = require('express');
import bodyParser = require('body-parser');
import fileUpload = require('express-fileupload');
import cors = require('cors');
import timeout = require('connect-timeout');
// import busboy = require('connect-busboy');

export default class Server {
  public app: express.Application;
  public port: number;

  constructor(puerto: number) {
    this.port = puerto;
    this.app = express();
    this.app.use(timeout('30000s'));
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(fileUpload());
    // this.app.use(busboy());
  }

  static init(puerto: number) {
    return new Server(puerto);
  }

  start(callback: () => void) {
    this.app.listen(this.port, callback);
  }
}
