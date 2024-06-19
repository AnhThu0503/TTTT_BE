import { NextFunction, Request, Response } from "express"
import { prismaClient } from "..";
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignUpSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    SignUpSchema.parse(req.body)
    const { userName, userEmail, userHashPass } = req.body;
    let user = await prismaClient.user.findFirst({ where: { userName } })
    if (user) {
        new BadRequestsException('User already exists!', ErrorCode.USER_ALREADY_EXISTS)
    }
    user = await prismaClient.user.create({
        data: {
            userName,
            userHashPass: hashSync(userHashPass, 10),
            userEmail,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    });
    res.json(user)




}

export const signin = async (req: Request, res: Response) => {
    const { userName, userHashPass } = req.body;


    let user = await prismaClient.user.findFirst({ where: { userName } })
    if (!user) {
        throw new NotFoundException('User not found.', ErrorCode.USER_NOT_FOUND)
    }
    if (!compareSync(userHashPass, user.userHashPass)) {
        throw new BadRequestsException('Incorrect password', ErrorCode.INCORRECT_PASSWORD)
    }

    const token = jwt.sign({
        userID: user.userID
    }, JWT_SECRET)

    res.json({ user, token })
}

export const me = async (req: Request, res: Response) => {
    res.json(req.user);
}


