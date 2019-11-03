"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = require('nodemailer');
exports.sendEmail = function (req, res) {
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'example@gmail.com',
            pass: 'password'
        }
    });
    // Definimos el email
    var mailOptions = {
        from: 'Remitente',
        to: 'destinatario@gmail.com',
        subject: 'Asunto',
        text: 'Contenido del email'
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            res.status(500).json({
                ok: false,
                mensaje: err.message
            });
        }
        else {
            console.log('Email sent');
            res.status(200).jsonp(req.body);
        }
    });
};
