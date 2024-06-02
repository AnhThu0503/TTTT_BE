import { z } from 'zod'
//Validate data
export const SignUpSchema = z.object({
    userName: z.string(),
    userEmail: z.string().email(),
    userHashPass: z.string().min(6),
    isActive: z.boolean().default(true),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
})