"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
class MySQL {
    constructor() {
        this.conectado = false;
        console.log('Clase inicializada');
        this.conection = mysql.createConnection({
            host: 'localhost',
            user: 'grout',
            password: 'grout',
            // password: 'Alftech1!',
            database: 'sadca'
        });
        this.conectarDB();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    static ejecutarQuery(query, callback) {
        this.instance.conection.query(query, (err, results, fields) => {
            console.log(query);
            if (err) {
                console.log('Error en la query');
                console.log(err);
                // throw err;
                return callback(err);
            }
            if (results.length === 0) {
                callback('El registro solicitado no existe');
            }
            else {
                callback(null, results);
            }
        });
    }
    conectarDB() {
        this.conection.connect((err) => {
            if (err) {
                console.log(err.message);
                return;
            }
            this.conectado = true;
            console.log('Conectado a BBDD');
        });
    }
}
exports.default = MySQL;
