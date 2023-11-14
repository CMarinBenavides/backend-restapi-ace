import { connection } from "../config/db.js";

export const solicitud = {
    //este metodo es para obtener todas las solicitudes
    getSolicitudes: async (req, res) => {
        const [rows] = await connection.query("SELECT * FROM solicitud");
        if (rows.length <= 0) {
            res.status(404).json({ message: "No hay solicitudes" });
            return;
        }
        res.json(rows);
    },

    //este metodo es para obtener una solicitud
    getSolicitud: async (req, res) => {
        const [rows] = await connection.query("SELECT * FROM solicitud WHERE solicitud_id=?", [req.params.id]);
        if (rows.length <= 0) {
            res.status(404).json({ message: "Solicitud no encontrada" });
            return;
        }
        res.json(rows[0]);
    },

    //este metodo es crear una solicitud
    postSolicitud: async (req, res) => {
        const fecha = new Date(req.body.fecha);
        const fechaAtencion = new Date(req.body.fechaAtencion);
        const [result] = await connection
            .query("INSERT INTO solicitud(solicitud_estado,solicitud_fecha,solicitud_fecha_atencion) values(?,?,?)",
                [
                    req.body.estado,
                    fecha,
                    fechaAtencion
                ]);
        res.json({
            id: result.insertId,
            ...req.body
        });
    },

    //este metodo es para actualizar una solicitud

    putSolicitud: async (req, res) => {
        const [result] = await connection.query("UPDATE solicitud SET solicitud_estado=?,solicitud_fecha=?,solicitud_tipo=?,solicitud_descripcion=?,solicitud_usuario_id=? WHERE solicitud_id=?",
            [
                req.body.estado,
                req.body.fecha,
                req.body.tipo,
                req.body.descripcion,
                req.body.usuario_id,
                req.params.id
            ]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Solicitud no encontrada" });
            return;
        }
        res.json({
            id: req.params.id,
            ...req.body
        });
    },

    //este metodo es para eliminar una solicitud

    deleteSolicitud: async (req, res) => {
        const [result] = await connection.query("DELETE FROM solicitud WHERE solicitud_id=?", [req.params.id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Solicitud no encontrada" });
            return;
        }
        res.json({ message: "Solicitud eliminada" });
    }
}
