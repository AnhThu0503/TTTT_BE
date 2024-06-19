import { Router } from "express";
import { statisticTransaction } from "../controllers/statistic";
const transactionRoutes: Router = Router()
transactionRoutes.post('/statistic',statisticTransaction)
export default transactionRoutes