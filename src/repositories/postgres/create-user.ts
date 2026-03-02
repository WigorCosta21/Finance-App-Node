import { PostgresHelper } from '../../db/postgres/helper.js'

interface ICreateUserParams {
    id: string
    first_name: string
    last_name: string
    email: string
    password: string
}

export class PostgresCreateUserRepository {
    async execute(createUserParams: ICreateUserParams) {
        const results = await PostgresHelper.query(
            'INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',
            [
                createUserParams.id,
                createUserParams.first_name,
                createUserParams.last_name,
                createUserParams.email,
                createUserParams.password,
            ],
        )

        return results[0]
    }
}
