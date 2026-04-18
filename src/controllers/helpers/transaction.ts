import { notFound } from './http.js'

export const transactionNotFoundRespose = () => {
    return notFound('Transaction not found')
}
