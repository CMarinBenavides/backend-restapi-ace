import { connection } from "../config/db.js";

// password handler
import bcrypt from 'bcrypt';

export const usuario = {
    //este metodo es para obtener todos los usuarios
    getUsuarios: async (req, res) => {
        try {
            const [rows] = await connection.query("SELECT * FROM usuario");
            if (rows.length <= 0) {
                res.status(404).json({ message: "No hay usuarios" });
                return;
            }
            res.json(rows);
        } catch (error) {
            return res.status(500).json({
                message: 'Algo salio mal :( ',
            });
        }
    },

    //este metodo es para obtener un usuario
    getUsuario: async (req, res) => {
        try {
            const [rows] = await connection.query("SELECT * FROM usuario WHERE usuario_numero_identificacion=?", [req.params.id]);
            if (rows.length <= 0) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            res.json(rows[0]);
        } catch (error) {
            return res.status(500).json({
                message: 'Algo salio mal :( ',
            });
        }
    },

    //este metodo es crear un usuario
    postSignupUsuario: async (req, res) => {
        try {
            if (req.body.nombres == null || req.body.apellidos == null || req.body.tipo_identificacion == null || req.body.numero_identificacion == null || req.body.fecha_cumple == null || req.body.correo == null || req.body.telefono == null || req.body.clave == null) {
                res.status(400).json({ message: "Todos los campos son obligatorios" });
                return;
            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(req.body.nombres)) {
                res.status(400).json({ message: "El nombre solo puede contener letras y espacios" });
                return;
            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(req.body.apellidos)) {
                res.status(400).json({ message: "El apellido solo puede contener letras y espacios" });
                return;
            } else if (!/^[0-9]{5,10}$/.test(req.body.numero_identificacion)) {
                res.status(400).json({ message: "El numero de identificacion solo puede contener numeros y debe tener 10 digitos" });
                return;
            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(req.body.tipo_identificacion)) {
                res.status(400).json({ message: "El tipo de identificacion solo puede contener letras" });
                return;
            } else if (!new Date(req.body.fecha_cumple).getTime()) {
                res.status(400).json({ message: "La fecha de cumpleaños no es valida" });
                return;
            } else if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(req.body.correo)) {
                res.status(400).json({ message: "No esta en formato de correo" });
                return;
            } else if (!/^[0-9]{10}$/.test(req.body.telefono)) {
                res.status(400).json({ message: "El numero de telefono solo puede contener numeros y debe tener 10 digitos" });
                return;
            } else if (!/^[a-zA-Z0-9]{8,16}$/.test(req.body.clave)) {
                res.status(400).json({ message: "La clave solo puede contener letras y numeros y debe tener entre 8 y 16 caracteres" });
                return;
            } else if (req.body.clave != req.body.confirmar_clave) {
                res.status(400).json({ message: "Las claves no coinciden" });
                return;
            } else {
                const [rows] = await connection.query("SELECT * FROM usuario WHERE usuario_numero_identificacion=?", [req.body.numero_identificacion]);
                if (rows.length > 0) {
                    res.status(400).json({
                        status: "FAILED",
                        message: "El usuario ya existe"
                    });
                    return;
                }
            }
            // password handling
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.clave, salt)
                .catch(error => {
                    return res.status(500).json({
                        status: 500,
                        message: 'Algo salio mal al momento de encriptar la contraseña :(',
                    });
                });
            const [rows] = await connection
                .query("INSERT INTO usuario(usuario_nombres,usuario_apellidos,usuario_tipo_identificacion,usuario_numero_identificacion,usuario_fecha_cumple,usuario_correo,usuario_telefono,usuario_clave) values(?,?,?,?,?,?,?,?)",
                    [
                        req.body.nombres,
                        req.body.apellidos,
                        req.body.tipo_identificacion,
                        req.body.numero_identificacion,
                        req.body.fecha_cumple,
                        req.body.correo,
                        req.body.telefono,
                        hashedPassword]);
            res.json({
                status: "SUCCESS",
                message: "Usuario creado exitosamente",
                id: rows.insertId,
                data: {
                    nombres: req.body.nombres,
                    apellidos: req.body.apellidos,
                    tipo_identificacion: req.body.tipo_identificacion,
                    numero_identificacion: req.body.numero_identificacion,
                    fecha_cumple: req.body.fecha_cumple,
                    correo: req.body.correo,
                    telefono: req.body.telefono,
                    clave: hashedPassword
                }
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Algo salio mal :( ',
            });
        }
    },

    //este metodo es para iniciar sesion
    postSigninUsuario: async (req, res) => {
        try {
            const { correo, clave } = req.body;
            if (correo == null || clave == null) {
                res.json({
                    status: "FAILED",
                    message: "Todos los campos son obligatorios"
                });
                return;
            } else {
                const [rows] = await connection.query("SELECT * FROM usuario WHERE usuario_correo=?", [correo]);
                const user = rows[0];

                const validPassword = await bcrypt.compare(clave, user.usuario_clave);
                if (!validPassword) {
                    res.json({
                        status: "FAILED",
                        message: "La contraseña es incorrecta"
                    });
                    return;
                }
                res.json({
                    status: "SUCCESS",
                    message: "Usuario logeado exitosamente",
                    data: {
                        id: user.usuario_id,
                        nombres: user.usuario_nombres,
                        apellidos: user.usuario_apellidos,
                        tipo_identificacion: user.usuario_tipo_identificacion,
                        numero_identificacion: user.usuario_numero_identificacion,
                        fecha_cumple: user.usuario_fecha_cumple,
                        correo: user.usuario_correo,
                        telefono: user.usuario_telefono,
                        clave: user.usuario_clave
                    }
                });
                if (rows.length <= 0) {
                    res.json({
                        status: "FAILED",
                        message: "El usuario no existe"
                    });
                    return;
                }


            }
        } catch (error) {
            return res.json({
                status: 'FAILED',
                message: 'El correo o la contraseña son incorrectos',
            });
        }
    },

    //este metodo es para actualizar un usuario
    putUsuario: async (req, res) => {
        try {
            const [result] = await connection.query("UPDATE usuario SET usuario_nombres=?,usuario_apellidos=?,usuario_tipo_identificacion=?,usuario_numero_identificacion=?,usuario_fecha_cumple=?,usuario_correo=?,usuario_telefono=?,usuario_clave=? WHERE usuario_numero_identificacion=?",
                [
                    req.body.nombres,
                    req.body.apellidos,
                    req.body.tipo_identificacion,
                    req.body.numero_identificacion,
                    req.body.fecha_cumple,
                    req.body.correo,
                    req.body.telefono,
                    req.body.clave,
                    req.params.id
                ]);
            if (result.affectedRows === 0) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            res.json({
                id: result.insertId,
                ...req.body
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Algo salio mal :( ',
            });
        }
    },

    //este metodo es para eliminar un usuario
    deleteUsuario: async (req, res) => {
        try {
            const [result] = await connection.query("DELETE FROM usuario WHERE usuario_numero_identificacion=?", [req.params.id]);
            if (result.affectedRows === 0) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            res.json({
                message: "Usuario eliminado"
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Algo salio mal :( ',
            });
        }
    }

}