import express = require('express');
import bodyParser = require('body-parser');
import fileUpload = require('express-fileupload');
import cors = require('cors')

export default class Server {
  public app: express.Application;
  public port: number;

  constructor(puerto: number) {
    this.port = puerto;
    this.app = express();
    this.app.use(cors())
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(fileUpload({ useTempFiles: true }));
  }

  static init(puerto: number) {
    return new Server(puerto);
  }

  start(callback: () => void) {
    this.app.listen(this.port, callback);
  }
}
