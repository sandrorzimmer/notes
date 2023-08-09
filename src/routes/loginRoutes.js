import express from 'express';
import LoginController from '../controllers/loginController.js';

const router = express.Router();

router
    .post('/login', LoginController.authenticate);

export default router;
