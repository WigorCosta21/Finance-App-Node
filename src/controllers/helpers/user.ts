import validator from 'validator'
import { badRequest, notFound } from './http.js'

export const invalidPasswordResponse = () => {
    return badRequest({
        message: 'Password must be at least 6 characters',
    })
}

export const emailIsAlreadyInUserResponse = () => {
    return badRequest({
        message: 'Invalid e-mail. Please provide a valid one.',
    })
}

export const userNotFoundRespose = () => {
    return notFound('User not found')
}

export const checkIfPasswordIsValid = (password: string) => {
    return password.length >= 6
}

export const checkIfEmailIsValid = (email: string) => {
    return validator.isEmail(email)
}
