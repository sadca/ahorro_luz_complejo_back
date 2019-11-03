import { Router, Request, Response } from 'express';
const fs = require('fs');
const path = require('path');
import { PythonShell, Options } from 'python-shell';

const router = Router();

router.post('/', (req, res) => {
  let adjuntos: any = req.files;
  console.log(adjuntos);

  const body = req.body;
  console.log(body);
  console.log(body.propietario);
  console.log(body.tarifa);

  // let ruta = path.resolve(__dirname, '../public/valverde.py');
  let ruta = path.resolve(__dirname, '../public/calculo_potencias.py');
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

  adjuntos.archivo.mv(`dist/public/${adjuntos.archivo.name}`, (err: any) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err,
        message:
          'El archivo no se ha podido subir correctamente, pruebe de nuevo o contacte con el administrador'
      });
      return;
    }
  });

  let options: Options = {
    mode: 'json',
    pythonOptions: ['-u'],
    args: [nombreArchivo, 'Segundo parámetro', 'Tercero parámetro']
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

  PythonShell.run(ruta, options, (err: any, results: any) => {
    if (err) {
      console.log('Error');
      res.json({
        ok: false,
        err
      });
      return;
    } else {
      res.json({
        ok: true,
        results
      });
      return;
    }
  });
});

export default router;
