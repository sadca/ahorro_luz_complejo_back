import jwt = require('jsonwebtoken');
import { Response, Request } from 'express';
// require('../config/config');

// ======================================
// ==========VERIFICAR TOKEN=============
// ======================================
let verificaToken = (req: Request, res: Response, next: any) => {
  let token: any = req.get('token');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  const SEED = process.env.SEED || '';
  jwt.verify(token, SEED, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err
      });
    }

    next();
  });
};

export default verificaToken;
