"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const python_shell_1 = require("python-shell");
const fs = require('fs');
const path = require('path');
const router = express_1.Router();
router.post('/', (req, res) => {
    let adjuntos = req.files;
    console.log(adjuntos);
    const body = req.body;
    const tarifa = body.tarifa;
    const p1 = body.p1;
    const p2 = body.p2;
    const p3 = body.p3;
    console.log(body);
    console.log(body.propietario);
    console.log(body.tarifa);
    // let ruta = path.resolve(__dirname, '../public/valverde.py');
    // let ruta = path.resolve(__dirname, '../public/calculo_potencias.py');
    let ruta = path.resolve(__dirname, '../public/calculo_potencias_v2.py');
    // console.log(ruta);
    // ES0021000005611644WD
    if (!adjuntos || adjuntos.length === 0) {
        res.status(400).json({
            ok: false
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
    let options = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: [tarifa, nombreArchivo, p1, p2, p3]
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
            res.json({
                ok: true,
                results
            });
            return;
        }
    });
});
exports.default = router;
