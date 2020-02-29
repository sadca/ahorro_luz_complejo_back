import { Router, Request, Response } from 'express';
import { PythonShell, Options } from 'python-shell';
import MySQL from '../mysql/mysql';
import mdAutentication from '../middleware/autenticacion';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const path = require('path');

const router = Router();

router.post('/', [mdAutentication], (req: any, res: any) => {
  req.setTimeout(300000);
  let adjuntos: any = req.files;

  const body = req.body;
  const propietario = body.propietario;
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
  const precioP1opt = body.precioP1opt;
  const precioP2opt = body.precioP2opt;
  const precioP3opt = body.precioP3opt;
  const precioP4opt = body.precioP4opt;
  const precioP5opt = body.precioP5opt;
  const precioP6opt = body.precioP6opt;
  const precioE1Actual = body.precioE1Actual;
  const precioE2Actual = body.precioE2Actual;
  const precioE3Actual = body.precioE3Actual;
  const precioE4Actual = body.precioE4Actual;
  const precioE5Actual = body.precioE5Actual;
  const precioE6Actual = body.precioE6Actual;
  const precioE1Optimizada = body.precioE1Optimizada;
  const precioE2Optimizada = body.precioE2Optimizada;
  const precioE3Optimizada = body.precioE3Optimizada;
  const precioE4Optimizada = body.precioE4Optimizada;
  const precioE5Optimizada = body.precioE5Optimizada;
  const precioE6Optimizada = body.precioE6Optimizada;
  const impuestoElectrico = body.impuestoElectrico;
  const descuentoPotencia = body.descuentoPotencia;
  const descuentoEnergia = body.descuentoEnergia;
  const comparadorPrecios = body.comparadorPrecios;
  console.log(comparadorPrecios);

  // Versión actual
  let ruta = '';
  if (comparadorPrecios === 'true') {
    ruta = path.resolve(__dirname, '../public/calculo_comparador_precios.py');
  } else {
    if (
      tarifa == '6.1A' ||
      tarifa == '6.2' ||
      tarifa == '6.3' ||
      tarifa == '6.4' ||
      tarifa == '6.5'
    ) {
      ruta = path.resolve(__dirname, '../public/calculo_potencias_6x_v2.py');
    } else {
      ruta = path.resolve(__dirname, '../public/calculo_potencias_v4.py');
    }

    if (!adjuntos || adjuntos.length === 0) {
      res.status(400).json({
        ok: false,
        mensaje: 'No hay adjuntos'
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

  // console.log(tarifa, nombreArchivo, p1, p2, p3, p4, p5, p6);
  // console.log(
  //   calculoAutomatico,
  //   p1Calculos,
  //   p2Calculos,
  //   p3Calculos,
  //   p4Calculos,
  //   p5Calculos,
  //   p6Calculos
  // );
  // console.log(precioP1, precioP2, precioP3, precioP4, precioP5, precioP6);
  // console.log(
  //   precioE1Actual,
  //   precioE2Actual,
  //   precioE3Actual,
  //   precioE4Actual,
  //   precioE5Actual,
  //   precioE6Actual,
  //   precioE1Optimizada,
  //   precioE2Optimizada,
  //   precioE3Optimizada,
  //   precioE4Optimizada,
  //   precioE5Optimizada,
  //   precioE6Optimizada
  // );

  let options: Options = {
    mode: 'json',
    pythonOptions: ['-u'],
    // pythonPath : '/root/anaconda3/bin/python3',
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
      precioP6opt
    ]
  };

  PythonShell.run(ruta, options, (err: any, results: any) => {
    if (err) {
      console.log('Error');
      res.json({
        ok: false,
        err
      });
      return;
    } else {
      console.log('Ok');
      let query: string =
        "INSERT INTO `historico_consultas` VALUES('" +
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
        p1Calculos +
        "','" +
        p2Calculos +
        "','" +
        p3Calculos +
        "','" +
        p4Calculos +
        "','" +
        p5Calculos +
        "','" +
        p6Calculos +
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
        "', CURRENT_TIMESTAMP)";
      MySQL.ejecutarQuery(query, (err: any, result: any) => {
        console.log('err', err);
        console.log('result', result);
      });
      res.json({
        ok: true,
        results
      });
      return;
    }
  });
});

router.get('/consultas', [mdAutentication], (req: any, res: any) => {
  let datos: any[] = [];
  let query: string = 'SELECT * FROM historico_consultas';
  MySQL.ejecutarQuery(query, (err: any, result: any) => {
    console.log('err', err);
    if (err) {
      res.json({
        ok: false,
        err
      });
      return;
    }
    datos = result;
    res.json({
      ok: true,
      datos
    });
  });
});

router.get('/', (req, res) => {
  res.json({
    ok: true
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
      mensaje: 'Tiene que indicar el usuario y contraseña'
    });
    return;
  }

  if (user != process.env.USER) {
    res.status(401).json({
      ok: false,
      mensaje: 'Usuario o contraseña incorrecta'
    });
    return;
  }

  // Encriptamos la contraseña
  var pass = bcrypt.hashSync(process.env.PASS || '', 10);

  if (!bcrypt.compareSync(body.pass, pass)) {
    res.status(401).json({
      ok: false,
      mensaje: 'Usuario o contraseña incorrecta'
    });
    return;
  }

  console.log(process.env.SEED);
  var token = jwt.sign({ usuario: body.usuario }, process.env.SEED || '', {
    expiresIn: 7200
  });

  res.json({
    ok: true,
    token
  });
});

router.delete('/consulta/:id', [mdAutentication], (req: any, res: any) => {
  var id = req.params.id;
  let datos: any[] = [];
  let query: string =
    'DELETE FROM historico_consultas WHERE DATE_FORMAT(fecha_alta,"%Y-%m-%d %H:%i:%S") = DATE_FORMAT("' +
    id +
    '","%Y-%m-%d %H:%i:%S")';
  MySQL.ejecutarQuery(query, (err: any, result: any) => {
    console.log('err', err);
    if (err) {
      res.json({
        ok: false,
        err
      });
      return;
    }
    datos = result;
    res.json({
      ok: true,
      datos
    });
  });
});

export default router;
