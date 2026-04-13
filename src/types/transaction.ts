import { z } from 'zod'
import type { createTransactionSchema } from '../schemas/transaction.js'

type TransactionType = 'EARNING' | 'EXPENSE' | 'INVESTMENT'

export interface Transaction {
    id: string
    user_id: string
    name: string
    date: string
    amount: number
    type: TransactionType
}

export type CreateTransactionParams = Omit<Transaction, 'id'>
export type CreateTransactionRepositoryParams = Transaction
export type CreateTransactionBody = z.input<typeof createTransactionSchema>

export interface TransactionIdParams {
    transactionId: string
}

export type UpdateTransactionParams = {
    name?: string
    date?: string
    amount?: number
    type?: TransactionType
}
