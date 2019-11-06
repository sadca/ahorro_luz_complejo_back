"use strict";
console.log(process.env.PORT);
// ======================================
// ==============PUERTO==================
// ======================================
process.env.PORT = process.env.PORT || '3000';
// ======================================
// ==============ENTORNO=================
// ======================================
process.env.NODE_ENV = process.env.NODE_ENV || 'des';
// ======================================
// =========VENCIMIENTO TOKEN============
// ======================================
const vencimiento = 30 * 60 * 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = vencimiento.toString();
// ======================================
// =======SEED DE AUTENTICACIÓN==========
// ======================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
// ======================================
// ============ENVIO CORREO==============
// ======================================
process.env.PASSMAIL = process.env.PASSMAIL || 'klwzxjmbjxiimvcf';
