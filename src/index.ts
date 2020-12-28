import Server from './server/server';
import router from './routes/router';

const env = require('node-env-file');
const path = require('path');

env(path.resolve(__dirname + '/.env'));

require('./config/config');

const port = Number(process.env.PORT) || 0;
const server = Server.init(port);

var fs = require('fs');
var https = require('https');

// PARA PRODUCCIÓN
// https
//   .createServer(
//     {
//       key: fs.readFileSync('./dist/public/sadca.es_2020.key'),
//       cert: fs.readFileSync('./dist/public/sadca.es_2020.crt'),
//     },
//     server.app
//   )
//   .listen(port, function () {
//     console.log('Servidor corriendo en el puerto ' + port + '...');
//   });

server.app.use(router);

// PARA DESARROLLO
server.start(() => {
  console.log('Servidor corriendo en el puerto', port);
});
