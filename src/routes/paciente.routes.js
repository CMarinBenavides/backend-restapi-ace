import { Router } from "express";
import { paciente } from "../controllers/paciente.controller.js";

const router = Router();

const { getPacientes, getPaciente, postPaciente, putPaciente, deletePaciente } = paciente;

router.get("/pacientes", (req, res) => {
    getPacientes(req, res);
});

router.get("/pacientes/:id", (req, res) => {
    getPaciente(req, res);
});

router.post("/pacientes", (req, res) => {
    postPaciente(req, res);
});

router.put("/pacientes/:id", (req, res) => {
    putPaciente(req, res);
});

router.delete("/pacientes/:id", (req, res) => {
    deletePaciente(req, res);
});

export default router;