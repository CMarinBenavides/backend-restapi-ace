import { Router } from "express";
import { solicitud } from "../controllers/solicitud.controller.js";

const router = Router();

const { getSolicitudes, getSolicitud, postSolicitud, putSolicitud, deleteSolicitud } = solicitud;

router.get("/solicitudes", (req, res) => {
    getSolicitudes(req, res);
});

router.get("/solicitudes/:id", (req, res) => {
    getSolicitud(req, res);
});

router.post("/solicitudes", (req, res) => {
    postSolicitud(req, res);
});

router.put("/solicitudes/:id", (req, res) => {
    putSolicitud(req, res);
});

router.delete("/solicitudes/:id", (req, res) => {
    deleteSolicitud(req, res);
});

export default router;