import { PostgresHelper } from '../../db/postgres/helper.js'

interface IUpdateUserParams {
    first_name?: string
    last_name?: string
    email?: string
    password?: string
}

export class PostgresUpdateUserRepository {
    async execute(userId: string, updateParams: IUpdateUserParams) {
        const updateFields: string[] = []
        const updateValues: unknown[] = []

        Object.keys(updateParams).forEach((key) => {
            const value = updateParams[key as keyof IUpdateUserParams]

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
