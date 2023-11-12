import { connection } from "../../config/db.js";

export const localizacion = {

    //este metodo es para obtener todas las localizaciones

    getLocalizaciones: async (req, res) => {
        const [rows] = await connection.query("SELECT * FROM localizacion");
        if (rows.length <= 0) {
            res.status(404).json({ message: "No hay localizaciones" });
            return;
        }
        res.json(rows);
    },

    //este metodo es para obtener una localizacion

    getLocalizacion: async (req, res) => {
        const [rows] = await connection.query("SELECT * FROM localizacion WHERE localizacion_id=?", [req.params.id]);
        if (rows.length <= 0) {
            res.status(404).json({ message: "Localizacion no encontrada" });
            return;
        }
        res.json(rows[0]);
    },

    //este metodo es crear una localizacion

    postLocalizacion: async (req, res) => {
        const [result] = await connection
            .query("INSERT INTO localizacion(localizacion_nombre,localizacion_descripcion) values(?,?)",
                [
                    req.body.nombre,
                    req.body.descripcion
                ]);
        res.json({
            id: result.insertId,
            ...req.body
        });
    },

    //este metodo es para actualizar una localizacion

    putLocalizacion: async (req, res) => {
        const [result] = await connection.query("UPDATE localizacion SET localizacion_nombre=?,localizacion_descripcion=? WHERE localizacion_id=?",
            [
                req.body.nombre,
                req.body.descripcion,
                req.params.id
            ]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Localizacion no encontrada" });
            return;
        }
        res.json({
            id: req.params.id,
            ...req.body
        });
    },

    //este metodo es para eliminar una localizacion

    deleteLocalizacion: async (req, res) => {
        const [result] = await connection.query("DELETE FROM localizacion WHERE localizacion_id=?", [req.params.id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Localizacion no encontrada" });
            return;
        }
        res.json({ message: "Localizacion eliminada correctamente" });
    }

}