import { connection } from "../../config/db.js";

export const enfermedad = {

    //este metodo es para obtener todas las enfermedades

    getEnfermedades: async (req, res) => {
        const [rows] = await connection.query("SELECT * FROM enfermedad");
        if (rows.length <= 0) {
            res.status(404).json({ message: "No hay enfermedades" });
            return;
        }
        res.json(rows);
    },

    //este metodo es para obtener una enfermedad

    getEnfermedad: async (req, res) => {
        const [rows] = await connection.query("SELECT * FROM enfermedad WHERE enfermedad_id=?", [req.params.id]);
        if (rows.length <= 0) {
            res.status(404).json({ message: "Enfermedad no encontrada" });
            return;
        }
        res.json(rows[0]);
    },

    //este metodo es crear una enfermedad

    postEnfermedad: async (req, res) => {
        const [result] = await connection
            .query("INSERT INTO enfermedad(enfermedad_nombre,enfermedad_descripcion) values(?,?)",
                [
                    req.body.nombre,
                    req.body.descripcion
                ]);
        res.json({
            id: result.insertId,
            ...req.body
        });
    },

    //este metodo es para actualizar una enfermedad

    putEnfermedad: async (req, res) => {
        const [result] = await connection.query("UPDATE enfermedad SET enfermedad_nombre=?,enfermedad_descripcion=? WHERE enfermedad_id=?",
            [
                req.body.nombre,
                req.body.descripcion,
                req.params.id
            ]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Enfermedad no encontrada" });
            return;
        }
        res.json({
            id: req.params.id,
            ...req.body
        });
    },

    //este metodo es para eliminar una enfermedad

    deleteEnfermedad: async (req, res) => {
        const [result] = await connection.query("DELETE FROM enfermedad WHERE enfermedad_id=?", [req.params.id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Enfermedad no encontrada" });
            return;
        }
        res.json({ message: "Enfermedad eliminada" });
    }
}

