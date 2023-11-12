import { Router } from "express";
import { localizacion } from "../controllers/localizacion.controller.js";

const router = Router();

const { getLocalizaciones, getLocalizacion, postLocalizacion, putLocalizacion, deleteLocalizacion } = localizacion;

router.get("/localizaciones", (req, res) => {
    getLocalizaciones(req, res);
});

router.get("/localizaciones/:id", (req, res) => {
    getLocalizacion(req, res);
});

router.post("/localizaciones", (req, res) => {
    postLocalizacion(req, res);
});

router.put("/localizaciones/:id", (req, res) => {
    putLocalizacion(req, res);
});

router.delete("/localizaciones/:id", (req, res) => {
    deleteLocalizacion(req, res);
});

export default router;