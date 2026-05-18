import { z } from 'zod'

export const createUserSchema = z.object({
    first_name: z.string().trim().min(1, {
        message: 'First name is required',
    }),
    last_name: z.string().trim().min(1, {
        message: 'Last name is required',
    }),
    email: z.email({
        message: 'Please provide a valid e-mail',
    }),
    password: z
        .string({
            message: 'Password is required',
        })
        .trim()
        .min(6, {
            message: 'Password must be at least 6 characters',
        }),
})

export const updateUserSchema = createUserSchema.partial().strict()

export const loginSchema = z.object({
    email: z
        .email({
            message: 'Please provide a valid e-mail',
        })
        .trim()
        .min(1, {
            message: 'E-mail is required',
        }),
    password: z
        .string({
            message: 'Password is required',
        })
        .trim()
        .min(6, {
            message: 'Password must be at least 6 characters',
        }),
})
