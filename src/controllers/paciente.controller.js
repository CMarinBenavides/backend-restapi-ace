import { connection } from "../../config/db.js";


export const paciente = {
    //este metodo es para obtener todos los pacientes
    getPacientes: async (req, res) => {
        const [rows] = await connection.query("SELECT * FROM paciente");
        if (rows.length <= 0) {
            res.status(404).json({ message: "No hay pacientes" });
            return;
        }
        res.json(rows);
    },

    //este metodo es para obtener un paciente
    getPaciente: async (req, res) => {
        const [rows] = await connection.query("SELECT * FROM paciente WHERE paciente_numero_identificacion=?", [req.params.id]);
        if (rows.length <= 0) {
            res.status(404).json({ message: "Paciente no encontrado" });
            return;
        }
        res.json(rows[0]);
    },

    //este metodo es crear un paciente
    // con estos datos paciente_nombres varchar(255), paciente_apellidos varchar(255), paciente_numero_identificacion bigint, grupo_sanguineo varchar(20), paciente_observaciones varchar(255)
    postPaciente: async (req, res) => {
        const [result] = await connection
            .query("INSERT INTO paciente(paciente_nombres,paciente_apellidos,paciente_tipo_identificacion,paciente_numero_identificacion,paciente_fecha_cumple,paciente_correo,paciente_telefono,paciente_clave) values(?,?,?,?,?,?,?,?)",
                [
                    req.body.nombres,
                    req.body.apellidos,
                    req.body.tipo_identificacion,
                    req.body.numero_identificacion,
                    req.body.fecha_cumple,
                    req.body.correo,
                    req.body.telefono,
                    req.body.clave]);
        //Agregamos las enfermedades del paciente en caso de que no existan las creamos en la tabla enfermedad
        if (req.body.enfermedades) {
            req.body.enfermedades.forEach(async (enfermedad) => {
                const [result] = await connection.query("SELECT * FROM enfermedad WHERE enfermedad_nombre=?", [enfermedad]);
                if (result.length <= 0) {
                    const [result2] = await connection.query("INSERT INTO enfermedad(enfermedad_nombre,enfermedad_descripcion) values(?,?)", [result.enfermedad_nombre, result.enfermedad_descripcion]);
                }
            });
        }
        // Agregamos dichas enfermedades al paciente
        if (req.body.enfermedades) {
            req.body.enfermedades.forEach(async (enfermedad) => {
                const [result] = await connection.query("INSERT INTO paciente_enfermedad(paciente_numero_identificacion,enfermedad_id) values(?,?)", [req.body.numero_identificacion, enfermedad]);
            });
        }
        res.json({
            id: result.insertId,
            ...req.body
        });
    },

    //este metodo es para actualizar un paciente
    putPaciente: async (req, res) => {
        const [result] = await connection.query("UPDATE paciente SET paciente_nombres=?,paciente_apellidos=?,paciente_tipo_identificacion=?,paciente_numero_identificacion=?,paciente_fecha_cumple=?,paciente_correo=?,paciente_telefono=?,paciente_clave=? WHERE paciente_numero_identificacion=?",
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
            res.status(404).json({ message: "Paciente no encontrado" });
            return;
        }
        //Agregamos las enfermedades del paciente en caso de que no existan las creamos en la tabla enfermedad
        if (req.body.enfermedades) {
            req.body.enfermedades.forEach(async (enfermedad) => {
                const [result] = await connection.query("SELECT * FROM enfermedad WHERE enfermedad_nombre=?", [enfermedad]);
                if (result.length <= 0) {
                    const [result2] = await connection.query("INSERT INTO enfermedad(enfermedad_nombre,enfermedad_descripcion) values(?,?)", [result.enfermedad_nombre, result.enfermedad_descripcion]);
                }
            });
        }
        // Eliminamos las enfermedades del paciente
        const [result3] = await connection.query("DELETE FROM paciente_enfermedad WHERE paciente_numero_identificacion=?", [req.params.id]);

        // Agregamos dichas enfermedades al paciente
        if (req.body.enfermedades) {
            req.body.enfermedades.forEach(async (enfermedad) => {
                const [result] = await connection.query("INSERT INTO paciente_enfermedad(paciente_numero_identificacion,enfermedad_id) values(?,?)", [req.body.numero_identificacion, enfermedad]);
            });
        }
        res.json({
            id: req.params.id,
            ...req.body
        });
    },

    //este metodo es para eliminar un paciente

    deletePaciente: async (req, res) => {
        const [result] = await connection.query("DELETE FROM paciente WHERE paciente_id=?", [req.params.id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Paciente no encontrado" });
            return;
        }
        res.json({ message: "Paciente eliminado" });
    }

}