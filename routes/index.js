import express from 'express';
import { loginController, registerController, userController, refreshController } from '../controller';
import { auth } from '../middlewares';
const router = express.Router();

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me', auth, userController.me);
router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);

export default router;