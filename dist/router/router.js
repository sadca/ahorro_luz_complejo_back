"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mysql_1 = __importDefault(require("../mysql/mysql"));
const router = express_1.Router();
router.get('/precio_potencia', (req, res) => {
    const query = `
                SELECT * 
                FROM precio_potencia`;
    mysql_1.default.ejecutarQuery(query, (err, precioPotencia) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        else {
            res.json({
                ok: true,
                precioPotencia
            });
        }
    });
});
router.get('/precio_energia', (req, res) => {
    const query = `
                SELECT * 
                FROM precio_energia`;
    mysql_1.default.ejecutarQuery(query, (err, precioEnergia) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        else {
            res.json({
                ok: true,
                precioEnergia
            });
        }
    });
});
router.get('/tarifas', (req, res) => {
    const query = `
                SELECT * 
                FROM tarifas`;
    mysql_1.default.ejecutarQuery(query, (err, tarifas) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        else {
            res.json({
                ok: true,
                tarifas
            });
        }
    });
});
exports.default = router;
