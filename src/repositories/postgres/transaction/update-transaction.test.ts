import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma.js'
import {
    makeTransaction,
    makeUserParams,
} from '../../../tests/fixtures/index.js'
import { PostgresUpdateTransactionRepository } from './update-transaction.js'
import { TransactionType } from '../../../../generated/prisma/enums.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

describe('PostgresUpdateTransactionRepository', () => {
    const user = makeUserParams()
    const transaction = makeTransaction()

    it('shoul update a transaction on db', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: {
                ...transaction,
                user_id: user.id,
                date: new Date(transaction.date),
            },
        })

        const sut = new PostgresUpdateTransactionRepository()

        const params = {
            id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            amount: faker.number.int({
                min: 100,
                max: 10000,
            }),
            type: TransactionType.EARNING,
        }

        const result = await sut.execute(transaction.id, params)

        expect(result?.id).toBe(params.id)
        expect(result?.name).toBe(params.name)
        expect(result?.type).toBe(params.type)
        expect(result?.user_id).toBe(user.id)
        expect(result?.amount).toBe(params.amount)
        expect(new Date(result!.date).toISOString().slice(0, 10)).toBe(
            new Date(params.date).toISOString().slice(0, 10),
        )
    })

    it('should call prisma with correnct params', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: {
                ...transaction,
                user_id: user.id,
                date: new Date(transaction.date),
            },
        })
        const sut = new PostgresUpdateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'update')

        await sut.execute(transaction.id, {
            name: transaction.name,
            date: transaction.date,
            amount: transaction.amount,
            type: transaction.type,
        })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
            data: {
                name: transaction.name,
                date: new Date(transaction.date),
                amount: transaction.amount,
                type: transaction.type,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresUpdateTransactionRepository()
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(transaction.id, transaction)

        await expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if Prisma throws P2025', async () => {
        const transaction = makeTransaction()
        const sut = new PostgresUpdateTransactionRepository()
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
                clientVersion: '0.0.0',
            }),
        )

        const promise = sut.execute(transaction.id, transaction)

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        )
    })
})
