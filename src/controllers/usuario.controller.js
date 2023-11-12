import { connection } from "../../config/db.js";


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
    postUsuario: async (req, res) => {
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
            } else if (!/^[0-9]{10}$/.test(req.body.numero_identificacion)) {
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
            } else if (getUsuario(req.body.numero_identificacion) != null) {
                res.status(400).json({ message: "El usuario ya existe" });
                return;
            }

            const [result] = await connection
                .query("INSERT INTO usuario(usuario_nombres,usuario_apellidos,usuario_tipo_identificacion,usuario_numero_identificacion,usuario_fecha_cumple,usuario_correo,usuario_telefono,usuario_clave) values(?,?,?,?,?,?,?,?)",
                    [
                        req.body.nombres,
                        req.body.apellidos,
                        req.body.tipo_identificacion,
                        req.body.numero_identificacion,
                        req.body.fecha_cumple,
                        req.body.correo,
                        req.body.telefono,
                        req.body.clave]);
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