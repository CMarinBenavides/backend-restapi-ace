import { Router } from 'express';
import { usuario } from '../controllers/usuario.controller.js';

const router = Router();

const { getUsuarios, getUsuario, postSignupUsuario, postSigninUsuario, putUsuario, deleteUsuario } = usuario;

router.get('/usuarios', (req, res) => {
    getUsuarios(req, res);
});

router.get('/usuarios/:id', (req, res) => {
    getUsuario(req, res);
});

router.post('/usuarios/signup', (req, res) => {
    postSignupUsuario(req, res);
});

router.post('/usuarios/signin', (req, res) => {
    postSigninUsuario(req, res);
});

router.put('/usuarios/:id', (req, res) => {
    putUsuario(req, res);
});

router.delete('/usuarios/:id', (req, res) => {
    deleteUsuario(req, res);
});

export default router;