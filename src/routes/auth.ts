import { Router } from "express";
import { me, signin, signup } from "../controllers/auth";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const authRoutes: Router = Router()

authRoutes.post('/signup',errorHandler(signup))
authRoutes.post('/signin',errorHandler(signin))
authRoutes.get('/me', authMiddleware, errorHandler(me))
export default authRoutes