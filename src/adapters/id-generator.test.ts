import { IdGeneratorAdapter } from './id-generator.js'

describe('IdGeneratorAdapter', () => {
    it('should return a random id', async () => {
        const sut = new IdGeneratorAdapter()

        const result = await sut.execute()

        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i
        expect(result).toMatch(uuidRegex)
    })
})
