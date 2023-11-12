import { Router } from 'express';

import { auth } from '../controllers/auth.controller.js';

const router = Router();

const { signin, signup } = auth;

router.post('/signin', (req, res) => {
    signin(req, res);
});

router.post('/signup', (req, res) => {
    signup(req, res);
});

