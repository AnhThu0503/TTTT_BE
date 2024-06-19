import { Router } from "express";
import authRoutes from "./auth";
import transactionRoutes from "./transaction"
const rootRouter: Router = Router()

rootRouter.use('/auth',authRoutes)
rootRouter.use('/transaction',transactionRoutes)
export default rootRouter;