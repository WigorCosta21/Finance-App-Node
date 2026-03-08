import { PostgresHelper } from '../../db/postgres/helper.js'
import type { UpdateUserParams } from '../../types/user.js'

export class PostgresUpdateUserRepository {
    async execute(userId: string, updateParams: UpdateUserParams) {
        const updateFields: string[] = []
        const updateValues: unknown[] = []

        Object.keys(updateParams).forEach((key) => {
            const value = updateParams[key as keyof UpdateUserParams]

            if (value !== undefined) {
                updateFields.push(`${key} = $${updateValues.length + 1}`)
                updateValues.push(value)
            }
        })

        updateValues.push(userId)

        const updateQuery = `
            UPDATE users
            SET ${updateFields.join(',')}
            WHERE id = $${updateValues.length}
            RETURNING *
        `

        const updateUser = await PostgresHelper.query(updateQuery, updateValues)

        return updateUser[0]
    }
}
