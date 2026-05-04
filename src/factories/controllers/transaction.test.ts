import { CreateTransactionController } from '../../controllers/index.js'
import { makeCreateTransactionController } from './transaction.js'

describe('TransationControllerFactories', () => {
    it('should returna valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
})
