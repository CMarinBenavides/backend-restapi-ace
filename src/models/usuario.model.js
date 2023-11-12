const mysql2 = require('mysql2/promise')

const Schema = mysql2.Schema

const UsuarioSchema = new Schema({
    usuario_nombres: String,
    usuario_apellidos: String,
    usuario_tipo_identificacion: String,
    usuario_numero_identificacion: BigInt,
    usuario_fecha_cumple: Date,
    usuario_correo: String,
    usuario_telefono: BigInt,
    usuario_clave: String
});

const Usuario = mysql2.model('Usuario', UsuarioSchema, 'usuario');

module.exports = Usuario;