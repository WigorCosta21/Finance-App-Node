import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    port: Number(process.env.DB_PORT) as number,
    database: process.env.DB_NAME as string,
})

export const PostgresHelper = {
    query: async (query: string, params?: unknown[]) => {
        const client = await pool.connect()

        const results = await client.query(query, params)

        await client.release()

        return results.rows
    },
}
