import Server from './server/server';
import router from './routes/router';
require('./config/config');

const port = Number(process.env.PORT) || 0;
const server = Server.init(port);
server.app.use(router);

// import MySQL from './mysql/mysql';
// MySQL.instance;

server.start(() => {
  console.log('Servidor corriendo en el puerto', port);
});
