"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const python_shell_1 = require("python-shell");
const mysql_1 = __importDefault(require("../mysql/mysql"));
const autenticacion_1 = __importDefault(require("../middleware/autenticacion"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path = require('path');
const router = express_1.Router();
router.get('/', (req, res) => {
    res.json({
        ok: true,
    });
});
router.post('/login', (req, res) => {
    console.log(req.body);
    var body = req.body;
    var password = body.pass;
    var user = body.usuario;
    if (!password || !user) {
        res.status(400).json({
            ok: false,
            mensaje: 'Tiene que indicar el usuario y contraseña',
        });
        return;
    }
    if (user != process.env.USERAPP) {
        res.status(401).json({
            ok: false,
            mensaje: 'Usuario o contraseña incorrecta',
        });
        return;
    }
    if (body.pass != process.env.PASS) {
        res.status(401).json({
            ok: false,
            mensaje: 'Usuario o contraseña incorrecta',
        });
        return;
    }
    console.log(process.env.SEED);
    var token = jsonwebtoken_1.default.sign({ usuario: body.usuario }, process.env.SEED || '', {
        expiresIn: 7200,
    });
    res.json({
        ok: true,
        token,
    });
});
router.post('/', [autenticacion_1.default], (req, res) => {
    req.setTimeout(300000);
    let adjuntos = req.files;
    const body = req.body;
    const propietario = body.propietario;
    const tarifa = body.tarifa;
    const calculoAutomatico = body.calculoAutomatico;
    const p1 = tratarNulos(body.p1);
    const p2 = tratarNulos(body.p2);
    const p3 = tratarNulos(body.p3);
    const p4 = tratarNulos(body.p4);
    const p5 = tratarNulos(body.p5);
    const p6 = tratarNulos(body.p6);
    const p1Opt = tratarNulos(body.p1Opt);
    const p2Opt = tratarNulos(body.p2Opt);
    const p3Opt = tratarNulos(body.p3Opt);
    const p4Opt = tratarNulos(body.p4Opt);
    const p5Opt = tratarNulos(body.p5Opt);
    const p6Opt = tratarNulos(body.p6Opt);
    const precioP1 = tratarNulos(body.precioP1);
    const precioP2 = tratarNulos(body.precioP2);
    const precioP3 = tratarNulos(body.precioP3);
    const precioP4 = tratarNulos(body.precioP4);
    const precioP5 = tratarNulos(body.precioP5);
    const precioP6 = tratarNulos(body.precioP6);
    const precioP1opt = tratarNulos(body.precioP1opt);
    const precioP2opt = tratarNulos(body.precioP2opt);
    const precioP3opt = tratarNulos(body.precioP3opt);
    const precioP4opt = tratarNulos(body.precioP4opt);
    const precioP5opt = tratarNulos(body.precioP5opt);
    const precioP6opt = tratarNulos(body.precioP6opt);
    const precioE1Actual = tratarNulos(body.precioE1Actual);
    const precioE2Actual = tratarNulos(body.precioE2Actual);
    const precioE3Actual = tratarNulos(body.precioE3Actual);
    const precioE4Actual = tratarNulos(body.precioE4Actual);
    const precioE5Actual = tratarNulos(body.precioE5Actual);
    const precioE6Actual = tratarNulos(body.precioE6Actual);
    const precioE1Optimizada = tratarNulos(body.precioE1Optimizada);
    const precioE2Optimizada = tratarNulos(body.precioE2Optimizada);
    const precioE3Optimizada = tratarNulos(body.precioE3Optimizada);
    const precioE4Optimizada = tratarNulos(body.precioE4Optimizada);
    const precioE5Optimizada = tratarNulos(body.precioE5Optimizada);
    const precioE6Optimizada = tratarNulos(body.precioE6Optimizada);
    const impuestoElectrico = tratarNulos(body.impuestoElectrico);
    const descuentoGeneral = tratarNulos(body.descuentoGeneral);
    const descuentoEnergia = tratarNulos(body.descuentoEnergia);
    const descuentoPotencia = tratarNulos(body.descuentoPotencia);
    const descuentoGeneralOpt = tratarNulos(body.descuentoGeneralOpt);
    const descuentoPotenciaOpt = tratarNulos(body.descuentoPotenciaOpt);
    const descuentoEnergiaOpt = tratarNulos(body.descuentoEnergiaOpt);
    const comparadorPrecios = body.comparadorPrecios;
    const fijoIndexado = body.fijoIndexado;
    const tarifaOptimizada = body.tarifaOptimizada;
    const fijoIndexadoOptimizada = body.fijoIndexadoOptimizada;
    const preMensPlanaAct = tratarNulos(body.preMensPlanaAct);
    const penalizacionAct = tratarNulos(body.penalizacionAct);
    const inicioPenalizacionAct = tratarNulos(body.inicioPenalizacionAct);
    const preMensPlanaOpt = tratarNulos(body.preMensPlanaOpt);
    const penalizacionOpt = tratarNulos(body.penalizacionOpt);
    const inicioPenalizacionOpt = tratarNulos(body.inicioPenalizacionOpt);
    const formulaIndexadoActual = body.formulaIndexadoActual;
    const formulaIndexadoOptim = body.formulaIndexadoOptim;
    const fee = tratarNulos(body.fee);
    const feeOpt = tratarNulos(body.feeOpt);
    const observaciones = tratarNulos(body.observaciones);
    const conceptoDescuento = tratarNulos(body.conceptoDescuento);
    const conceptoDescuentoOpt = tratarNulos(body.conceptoDescuentoOpt);
    // Versión actual
    let ruta = '';
    if (comparadorPrecios === 'true') {
        ruta = path.resolve(__dirname, '../public/calculo_comparador_precios_v2.py');
    }
    else {
        if (tarifa == '6.1A' ||
            tarifa == '6.2' ||
            tarifa == '6.3' ||
            tarifa == '6.4' ||
            tarifa == '6.5') {
            ruta = path.resolve(__dirname, '../public/calculo_potencias_6x_v2.py');
        }
        else {
            ruta = path.resolve(__dirname, '../public/calculo_potencias_v4.py');
        }
        if (!adjuntos || adjuntos.length === 0) {
            res.status(400).json({
                ok: false,
                mensaje: 'No hay adjuntos',
            });
            return;
        }
    }
    console.log(ruta);
    let nombreExtension = adjuntos.archivo.name.split('.');
    let nombreArchivo = nombreExtension[0];
    let extensionArchivo = nombreExtension[1];
    if (extensionArchivo != 'xlsx') {
        res.status(400).json({
            ok: false,
            message: 'Debe adjuntar un archivo con extensión .xlsx',
        });
        return;
    }
    // adjuntos.archivo.mv(`./public/${adjuntos.archivo.name}`, (err: any) => {
    adjuntos.archivo.mv(`dist/public/${adjuntos.archivo.name}`, (err) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
                message: 'El archivo no se ha podido subir correctamente, pruebe de nuevo o contacte con el administrador',
            });
            return;
        }
    });
    let options = {
        mode: 'json',
        pythonOptions: ['-u'],
        // pythonPath: '/root/anaconda3/bin/python3',
        args: [
            tarifa,
            nombreArchivo,
            p1,
            p2,
            p3,
            p4,
            p5,
            p6,
            calculoAutomatico,
            p1Opt,
            p2Opt,
            p3Opt,
            p4Opt,
            p5Opt,
            p6Opt,
            precioP1,
            precioP2,
            precioP3,
            precioP4,
            precioP5,
            precioP6,
            precioE1Actual,
            precioE2Actual,
            precioE3Actual,
            precioE4Actual,
            precioE5Actual,
            precioE6Actual,
            precioE1Optimizada,
            precioE2Optimizada,
            precioE3Optimizada,
            precioE4Optimizada,
            precioE5Optimizada,
            precioE6Optimizada,
            precioP1opt,
            precioP2opt,
            precioP3opt,
            precioP4opt,
            precioP5opt,
            precioP6opt,
            fijoIndexado,
            tarifaOptimizada,
            fijoIndexadoOptimizada,
            preMensPlanaAct,
            penalizacionAct,
            inicioPenalizacionAct,
            preMensPlanaOpt,
            penalizacionOpt,
            inicioPenalizacionOpt,
            formulaIndexadoActual,
            formulaIndexadoOptim,
            fee,
            feeOpt,
            impuestoElectrico,
            descuentoGeneral,
            descuentoPotencia,
            descuentoEnergia,
            descuentoGeneralOpt,
            descuentoPotenciaOpt,
            descuentoEnergiaOpt,
        ],
    };
    let query = "INSERT INTO `historico_consultas` VALUES('" +
        propietario +
        "','" +
        tarifa +
        "','" +
        p1 +
        "','" +
        p2 +
        "','" +
        p3 +
        "','" +
        p4 +
        "','" +
        p5 +
        "','" +
        p6 +
        "','" +
        p1Opt +
        "','" +
        p2Opt +
        "','" +
        p3Opt +
        "','" +
        p4Opt +
        "','" +
        p5Opt +
        "','" +
        p6Opt +
        "','" +
        calculoAutomatico +
        "','" +
        precioP1 +
        "','" +
        precioP2 +
        "','" +
        precioP3 +
        "','" +
        precioP4 +
        "','" +
        precioP5 +
        "','" +
        precioP6 +
        "','" +
        precioP1opt +
        "','" +
        precioP2opt +
        "','" +
        precioP3opt +
        "','" +
        precioP4opt +
        "','" +
        precioP5opt +
        "','" +
        precioP6opt +
        "','" +
        precioE1Actual +
        "','" +
        precioE2Actual +
        "','" +
        precioE3Actual +
        "','" +
        precioE4Actual +
        "','" +
        precioE5Actual +
        "','" +
        precioE6Actual +
        "','" +
        precioE1Optimizada +
        "','" +
        precioE2Optimizada +
        "','" +
        precioE3Optimizada +
        "','" +
        precioE4Optimizada +
        "','" +
        precioE5Optimizada +
        "','" +
        precioE6Optimizada +
        "','" +
        impuestoElectrico +
        "','" +
        descuentoPotencia +
        "','" +
        descuentoEnergia +
        "','" +
        nombreArchivo +
        "', CURRENT_TIMESTAMP, '" +
        tarifaOptimizada +
        "','" +
        fijoIndexado +
        "','" +
        fijoIndexadoOptimizada +
        "','" +
        observaciones +
        "','" +
        descuentoGeneral +
        "','" +
        descuentoGeneralOpt +
        "','" +
        descuentoPotenciaOpt +
        "','" +
        descuentoEnergiaOpt +
        "','" +
        conceptoDescuento +
        "','" +
        conceptoDescuentoOpt +
        "','" +
        0 +
        "','" +
        preMensPlanaAct +
        "','" +
        penalizacionAct +
        "','" +
        inicioPenalizacionAct +
        "','" +
        preMensPlanaOpt +
        "','" +
        penalizacionOpt +
        "','" +
        inicioPenalizacionOpt +
        "')";
    mysql_1.default.ejecutarQuery(query, (err, result) => {
        console.log('err', err);
        console.log('result', result);
    });
    python_shell_1.PythonShell.run(ruta, options, (err, results) => {
        if (err) {
            console.log('Error', err);
            res.json({
                ok: false,
                err,
            });
            return;
        }
        else {
            console.log('Ok');
            res.json({
                ok: true,
                results,
            });
            return;
        }
    });
});
router.get('/consultas', [autenticacion_1.default], (req, res) => {
    let datos = [];
    let query = 'SELECT * FROM historico_consultas order by fecha_alta desc';
    mysql_1.default.ejecutarQuery(query, (err, result) => {
        console.log('err', err);
        if (err) {
            res.json({
                ok: false,
                err,
            });
            return;
        }
        datos = result;
        res.json({
            ok: true,
            datos,
        });
    });
});
router.delete('/consulta/:id', [autenticacion_1.default], (req, res) => {
    var id = req.params.id;
    let datos = [];
    let query = 'DELETE FROM historico_consultas WHERE DATE_FORMAT(fecha_alta,"%Y-%m-%d %H:%i:%S") = DATE_FORMAT("' +
        id +
        '","%Y-%m-%d %H:%i:%S")';
    mysql_1.default.ejecutarQuery(query, (err, result) => {
        console.log('err', err);
        if (err) {
            res.json({
                ok: false,
                err,
            });
            return;
        }
        datos = result;
        res.json({
            ok: true,
            datos,
        });
    });
});
router.post('/gas', [autenticacion_1.default], (req, res) => {
    req.setTimeout(300000);
    const body = req.body;
    const propietario = body.propietario;
    const tarifa = body.tarifa;
    const terFijoAct = body.terFijoAct;
    const terEnerAct = body.terEnerAct;
    const terFijoNew = body.terFijoNew;
    const terEnerNew = body.terEnerNew;
    const impuesto = body.impuesto;
    const descuento = body.descuento;
    let ruta = path.resolve(__dirname, '../public/calculo_gas.py');
    let adjuntos = req.files;
    if (!adjuntos || adjuntos.length === 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'No hay adjuntos',
        });
        return;
    }
    let nombreExtension = adjuntos.archivo.name.split('.');
    let nombreArchivo = nombreExtension[0];
    let extensionArchivo = nombreExtension[1];
    if (extensionArchivo != 'xlsx') {
        res.status(400).json({
            ok: false,
            message: 'Debe adjuntar un archivo con extensión .xlsx',
        });
        return;
    }
    adjuntos.archivo.mv(`./public/${adjuntos.archivo.name}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
                message: 'El archivo no se ha podido subir correctamente, pruebe de nuevo o contacte con el administrador',
            });
        }
    });
    let options = {
        mode: 'json',
        pythonOptions: ['-u'],
        pythonPath: '/root/anaconda3/bin/python3',
        args: [
            tarifa,
            nombreArchivo,
            terFijoAct,
            terEnerAct,
            terFijoNew,
            terEnerNew,
        ],
    };
    python_shell_1.PythonShell.run(ruta, options, (err, results) => {
        if (err) {
            console.log('Error');
            return res.json({
                ok: false,
                err,
            });
        }
        else {
            console.log('Ok');
            let query = "INSERT INTO `historico_consultas_gas` VALUES('" +
                propietario +
                "','" +
                tarifa +
                "','" +
                terFijoAct +
                "','" +
                terEnerAct +
                "','" +
                terFijoNew +
                "','" +
                terEnerNew +
                "','" +
                impuesto +
                "','" +
                descuento +
                "','" +
                nombreArchivo +
                "', CURRENT_TIMESTAMP)";
            mysql_1.default.ejecutarQuery(query, (err, result) => {
                console.log('err', err);
                console.log('result', result);
            });
            return res.json({
                ok: true,
                results,
            });
        }
    });
});
router.get('/consultasgas', [autenticacion_1.default], (req, res) => {
    let datos = [];
    let query = 'SELECT * FROM historico_consultas_gas order by fecha_alta desc';
    mysql_1.default.ejecutarQuery(query, (err, result) => {
        console.log('err', err);
        if (err) {
            res.json({
                ok: false,
                err,
            });
            return;
        }
        datos = result;
        res.json({
            ok: true,
            datos,
        });
    });
});
router.delete('/consultagas/:id', [autenticacion_1.default], (req, res) => {
    var id = req.params.id;
    let datos = [];
    let query = 'DELETE FROM historico_consultas_gas WHERE DATE_FORMAT(fecha_alta,"%Y-%m-%d %H:%i:%S") = DATE_FORMAT("' +
        id +
        '","%Y-%m-%d %H:%i:%S")';
    mysql_1.default.ejecutarQuery(query, (err, result) => {
        console.log('err', err);
        if (err) {
            res.json({
                ok: false,
                err,
            });
            return;
        }
        datos = result;
        res.json({
            ok: true,
            datos,
        });
    });
});
function tratarNulos(valor) {
    if (valor == undefined ||
        valor == 'undefined' ||
        valor == 'null' ||
        valor == null) {
        return 0;
    }
    else {
        return valor;
    }
}
exports.default = router;
