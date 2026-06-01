import validator from 'validator'
import { z } from 'zod'
export const createTransactionSchema = z.object({
    name: z.string().trim().min(1, {
        message: 'Name is required.',
    }),
    date: z.iso.date('Date must be a valid date'),
    type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
        error: 'Type must be EARNING, EXPENSE, INVESTMENT',
    }),
    amount: z
        .number({
            message: 'Amount must be a number',
        })
        .min(1, { message: 'Amount must be greater than 0.' })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            }),
        ),
})

export const updateTransactionSchema = createTransactionSchema
    .partial()
    .strict()
