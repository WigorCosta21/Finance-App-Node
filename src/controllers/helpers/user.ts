import { notFound } from './http.js'

export const userNotFoundRespose = () => {
    return notFound('User not found')
}
