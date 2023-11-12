import { Router } from 'express';
import { usuario } from '../controllers/usuario.controller.js';

const router = Router();

const { getUsuarios, getUsuario, postUsuario, putUsuario, deleteUsuario } = usuario;

router.get('/usuarios', (req, res) => {
    getUsuarios(req, res);
});

router.get('/usuarios/:id', (req, res) => {
    getUsuario(req, res);
});

router.post('/usuarios', (req, res) => {
    postUsuario(req, res);
});

router.put('/usuarios/:id', (req, res) => {
    putUsuario(req, res);
});

router.delete('/usuarios/:id', (req, res) => {
    deleteUsuario(req, res);
});

export default router;