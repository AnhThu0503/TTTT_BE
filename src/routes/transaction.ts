import { Router } from "express";
import { statisticTransaction } from "../controllers/statistic";
import { statisCategory } from "../controllers/statisticCategory";
const transactionRoutes: Router = Router()
transactionRoutes.post('/statistic', statisticTransaction)
transactionRoutes.post('/statistic/category', statisCategory)

export default transactionRoutes