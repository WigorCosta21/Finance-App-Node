import {
    CreateTransactionController,
    UpdateTransactionController,
} from '../../controllers/index.js'
import {
    makeCreateTransactionController,
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
})
