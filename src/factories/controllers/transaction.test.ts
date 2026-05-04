import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController,
} from '../../controllers/index.js'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactiosByUserIdController,
    makeUpdateTransactionController,
} from './transaction.js'

describe('TransationControllerFactories', () => {
    it('should returna valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should returna valid UpdateTransactionController instance', () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })

    it('should returna valid DeleteTransactionController instance', () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        )
    })

    it('should returna valid GetTransactionByIdController instance', () => {
        expect(makeGetTransactiosByUserIdController()).toBeInstanceOf(
            GetTransactionsByUserIdController,
        )
    })
})
