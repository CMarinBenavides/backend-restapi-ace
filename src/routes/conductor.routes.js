import { Router } from "express";
import { conductor } from "../controllers/conductor.controller.js";

const router = Router();

const { getConductores, getConductor, postConductor, putConductor, deleteConductor } = conductor;

router.get("/conductores", (req, res) => {
    getConductores(req, res);
});

router.get("/conductores/:id", (req, res) => {
    getConductor(req, res);
});

router.post("/conductores", (req, res) => {
    postConductor(req, res);
});

router.put("/conductores/:id", (req, res) => {
    putConductor(req, res);
});

router.delete("/conductores/:id", (req, res) => {
    deleteConductor(req, res);
});

export default router;