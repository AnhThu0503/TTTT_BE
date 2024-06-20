import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekday from 'dayjs/plugin/weekday';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);
dayjs.extend(quarterOfYear);

export const statisCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userid, startDate, endDate } = req.body;
    try {
        const result = await prismaClient.transaction.groupBy({
            by: ['categoryID'],
            where: {
                transactionDate: {
                    gte: startDate,
                    lte: endDate,
                },
                isDeleted: 0,  // Ensure only non-deleted transactions are considered
                userID: userid,  // Filter by user ID if needed
            },
            _sum: {
                transactionAmount: true,
            },
            _count: {
                _all: true,
            },
        });

        // Add categoryName to the result
        const categories = await prismaClient.category.findMany({
            where: {
                categoryID: {
                    in: result.map(r => r.categoryID),
                },
            },
            select: {
                categoryID: true,
                categoryName: true,
            },
        });

        const dataResponse = result.map(r => {
            const category = categories.find(c => c.categoryID === r.categoryID);
            return {
                categoryName: category ? category.categoryName : 'Unknown Category',
                totalAmount: Number(r._sum.transactionAmount),
                transactionCount: r._count._all,
            };
        });

        res.json({ dataResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching statistics." });
    }
};
