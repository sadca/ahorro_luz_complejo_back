"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const python_shell_1 = require("python-shell");
const path = require('path');
const router = express_1.Router();
router.post('/', (req, res) => {
    req.setTimeout(300000);
    let adjuntos = req.files;
    const body = req.body;
    const tarifa = body.tarifa;
    const calculoAutomatico = body.calculoAutomatico;
    const p1 = body.p1;
    const p2 = body.p2;
    const p3 = body.p3;
    const p4 = body.p4;
    const p5 = body.p5;
    const p6 = body.p6;
    const p1Calculos = body.p1Calculos;
    const p2Calculos = body.p2Calculos;
    const p3Calculos = body.p3Calculos;
    const p4Calculos = body.p4Calculos;
    const p5Calculos = body.p5Calculos;
    const p6Calculos = body.p6Calculos;
    const precioP1 = body.precioP1;
    const precioP2 = body.precioP2;
    const precioP3 = body.precioP3;
    const precioP4 = body.precioP4;
    const precioP5 = body.precioP5;
    const precioP6 = body.precioP6;
    // let ruta = path.resolve(__dirname, '../public/calculo_potencias.py');
    // let ruta = path.resolve(__dirname, '../public/calculo_potencias_v2.py');
    // let ruta = path.resolve(__dirname, '../public/calculo_potencias_v3.py');
    // Versión actual
    let ruta = '';
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
    // Prueba
    // let ruta = path.resolve(__dirname, '../public/calculo_potencias_6x_v1.py');
    // ES0021000005611644WD
    if (!adjuntos || adjuntos.length === 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'No hay adjuntos'
        });
        return;
    }
    let nombreExtension = adjuntos.archivo.name.split('.');
    let nombreArchivo = nombreExtension[0];
    let extensionArchivo = nombreExtension[1];
    if (extensionArchivo != 'xlsx') {
        res.status(400).json({
            ok: false,
            message: 'Debe adjuntar un archivo con extensión .xlsx'
        });
        return;
    }
    adjuntos.archivo.mv(`dist/public/${adjuntos.archivo.name}`, (err) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err,
                message: 'El archivo no se ha podido subir correctamente, pruebe de nuevo o contacte con el administrador'
            });
            return;
        }
    });
    console.log(tarifa, nombreArchivo, p1, p2, p3, p4, p5, p6);
    console.log(calculoAutomatico, p1Calculos, p2Calculos, p3Calculos, p4Calculos, p5Calculos, p6Calculos);
    console.log(precioP1, precioP2, precioP3, precioP4, precioP5, precioP6);
    let options = {
        mode: 'json',
        pythonOptions: ['-u'],
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
            p1Calculos,
            p2Calculos,
            p3Calculos,
            p4Calculos,
            p5Calculos,
            p6Calculos,
            precioP1,
            precioP2,
            precioP3,
            precioP4,
            precioP5,
            precioP6
        ]
    };
    //   mode?: 'text' | 'json' | 'binary';
    //   formatter?: (param: string) => any;
    //   parser?: (param: string) => any;
    //   stderrParser?: (param: string) => any;
    //   encoding?: string;
    //   pythonPath?: string;
    //   /**
    //    * see https://docs.python.org/3.7/using/cmdline.html
    //    */
    //   pythonOptions?: string[];
    //   /**
    //    * overrides scriptPath passed into PythonShell constructor
    //    */
    //   scriptPath?: string;
    //   /**
    //    * arguments to your program
    //    */
    //   args?: string[];
    // let pyshell = new PythonShell(ruta, options);
    python_shell_1.PythonShell.run(ruta, options, (err, results) => {
        if (err) {
            console.log('Error');
            res.json({
                ok: false,
                err
            });
            return;
        }
        else {
            console.log('Ok');
            res.json({
                ok: true,
                results
            });
            return;
        }
    });
});
exports.default = router;
