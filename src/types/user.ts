import type { ParamsDictionary } from 'express-serve-static-core'

export interface User {
    id: string
    first_name: string
    last_name: string
    email: string
    password: string
}

export type CreateUserParams = Omit<User, 'id'>

export type UpdateUserParams = Partial<Omit<User, 'id'>>

export type UserIdParams = ParamsDictionary & {
    userId: string
}

export interface UserIdQuery {
    userId: string
}

export type PublicUser = Omit<User, 'password'>

export interface UserBalance {
    earnings: number
    expenses: number
    investments: number
    balance: number
}
