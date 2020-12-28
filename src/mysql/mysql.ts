import mysql = require('mysql');
export default class MySQL {
  private static _instance: MySQL;

  conection: mysql.Connection;
  conectado: boolean = false;

  constructor() {
    console.log('Clase inicializada');

    this.conection = mysql.createConnection({
      host: 'www.sadca.es',
      user: process.env.USERBBDD,
      password: process.env.PASSBBDD,
      database: process.env.BBDD
    });

    this.conectarDB();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  static ejecutarQuery(query: string, callback: Function) {
    this.instance.conection.query(query, (err, results: Object[], fields) => {
      console.log(query);
      if (err) {
        console.log('Error en la query');
        console.log(err);
        // throw err;
        return callback(err);
      }
      if (results.length === 0) {
        callback('El registro solicitado no existe');
      } else {
        callback(null, results);
      }
    });
  }

  private conectarDB() {
    this.conection.connect((err: mysql.MysqlError) => {
      if (err) {
        console.log(err.message);
        return;
      }
      this.conectado = true;
      console.log('Conectado a BBDD');
    });
  }
}
