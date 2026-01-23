import express from 'express';
import AuthController from '../controllers/auth.controller';
import LoginRequest from '../request/auth/login.request';

const router = express.Router();

router.post('/login', LoginRequest.validate, AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', AuthController.me);

export const AuthRoutes = { routes: router };
