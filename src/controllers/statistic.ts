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

export const statisticTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userid, arrayRangeQuery, type } = req.body;
    if (!Array.isArray(arrayRangeQuery) || !arrayRangeQuery.every(item => Array.isArray(item) && item.length === 2)) {
        return res.status(400).json({ error: "Invalid arrayMonthQuery format." });
    }
    let dataResponse: any[] = [];
    try {
        await Promise.all(arrayRangeQuery.map(async (item: [string, string]) => {
            const [startDate, endDate] = item;
            let formattedStartDate = dayjs(startDate);
            let formattedEndDate = dayjs(endDate);
            let period = '';

            switch (type) {
                case 'week':
                    formattedStartDate = formattedStartDate.startOf('week');
                    formattedEndDate = formattedEndDate.endOf('week');
                    period = 'week';
                    break;
                case 'month':
                    formattedStartDate = formattedStartDate.startOf('month');
                    formattedEndDate = formattedEndDate.endOf('month');
                    period = 'month';
                    break;
                case 'quarter':
                    formattedStartDate = formattedStartDate.startOf('quarter');
                    formattedEndDate = formattedEndDate.endOf('quarter');
                    period = 'quarter';
                    break;
                case 'year':
                    formattedStartDate = formattedStartDate.startOf('year');
                    formattedEndDate = formattedEndDate.endOf('year');
                    period = 'year';
                    break;
                default:
                    return res.status(400).json({ error: "Invalid type." });
            }

            const formattedStartDateStr = formattedStartDate.format('YYYY-MM-DD');
            const formattedEndDateStr = formattedEndDate.format('YYYY-MM-DD');

            const dataQueryExpenses: any = await prismaClient.$queryRaw`
                SELECT SUM(t.transactionAmount) AS totalAmountExpenses
                FROM transaction t
                JOIN category c ON t.categoryID = c.categoryID
                WHERE t.userID = ${userid}
                AND t.isDeleted = 0
                AND c.categoryType = 1
                AND t.transactionDate BETWEEN ${formattedStartDateStr} AND ${formattedEndDateStr}
            `;
            const dataQueryIncome: any = await prismaClient.$queryRaw`
                SELECT SUM(t.transactionAmount) AS totalAmountIncome
                FROM transaction t
                JOIN category c ON t.categoryID = c.categoryID
                WHERE t.userID = ${userid}
                AND t.isDeleted = 0
                AND c.categoryType = 0
                AND t.transactionDate BETWEEN ${formattedStartDateStr} AND ${formattedEndDateStr}
            `;

            const periodLabel = `${formattedStartDate.format('YYYY-MM-DD')} to ${formattedEndDate.format('YYYY-MM-DD')}`;

            dataResponse.push({
                period: periodLabel,
                dataQueryExpenses: dataQueryExpenses[0]?.totalAmountExpenses || 0,
                dataQueryIncome: dataQueryIncome[0]?.totalAmountIncome || 0,
            });
        }));

        res.json({ dataResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching statistics." });
    }
};
