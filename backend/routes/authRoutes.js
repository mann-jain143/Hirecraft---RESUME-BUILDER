import express from 'express';
// Wildcard import: Grabs everything so it never crashes on a mismatched name!
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Automatically detects what you named your functions in the controller
const registerHandler = authController.register || authController.registerUser || authController.signup;
const loginHandler = authController.login || authController.loginUser || authController.authUser || authController.authenticateUser;

if (registerHandler) {
  router.post('/register', registerHandler);
}

if (loginHandler) {
  router.post('/login', loginHandler);
}

export default router;