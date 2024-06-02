import { user } from '@prisma/client'
import express from 'express'
declare module 'express'{
    export interface Request{
        user?: user
    }
}