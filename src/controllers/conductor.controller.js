import { connection } from "../../config/db.js";

export const conductor = {

    //este metodo es para obtener todos los conductores

    getConductores: async (req, res) => {
        const [rows] = await connection.query("SELECT * FROM conductor");
        if (rows.length <= 0) {
            res.status(404).json({ message: "No hay conductores" });
            return;
        }
        res.json(rows);
    },

    //este metodo es para obtener un conductor

    getConductor: async (req, res) => {
        const [rows] = await connection.query("SELECT * FROM conductor WHERE conductor_id=?", [req.params.id]);
        if (rows.length <= 0) {
            res.status(404).json({ message: "Conductor no encontrado" });
            return;
        }
        res.json(rows[0]);
    },

    //este metodo es crear un conductor

    postConductor: async (req, res) => {
        const [result] = await connection
            .query("INSERT INTO conductor(conductor_nombres,conductor_apellidos,conductor_tipo_identificacion,conductor_numero_identificacion,conductor_fecha_cumple,conductor_correo,conductor_telefono,conductor_clave) values(?,?,?,?,?,?,?,?)",
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
    },

    //este metodo es para actualizar un conductor

    putConductor: async (req, res) => {
        const [result] = await connection.query("UPDATE conductor SET conductor_nombres=?,conductor_apellidos=?,conductor_tipo_identificacion=?,conductor_numero_identificacion=?,conductor_fecha_cumple=?,conductor_correo=?,conductor_telefono=?,conductor_clave=? WHERE conductor_numero_identificacion=?",
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
            res.status(404).json({ message: "Conductor no encontrado" });
            return;
        }
        res.json({
            id: req.params.id,
            ...req.body
        });
    },

    //este metodo es para eliminar un conductor

    deleteConductor: async (req, res) => {
        const [result] = await connection.query("DELETE FROM conductor WHERE conductor_id=?", [req.params.id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Conductor no encontrado" });
            return;
        }
        res.json({ message: "Conductor eliminado" });
    }
}