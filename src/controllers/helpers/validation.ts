import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id: string) => {
    return validator.isUUID(id)
}

export const invalidIdResponse = () => {
    return badRequest({
        message: 'The provided id is not valid',
    })
}

export const requiredFieldIsMissing = (field: string) => {
    return badRequest({
        message: `The field ${field} is required.`,
    })
}
export const validateRequiredFields = <T extends object>(
    params: T,
    requiredFields: (keyof T)[],
) => {
    for (const field of requiredFields) {
        const value = params[field]

        const fieldIsMissing = value === undefined || value === null

        const fieldIsEmpty =
            typeof value === 'string' &&
            validator.isEmpty(value, { ignore_whitespace: true })

        if (fieldIsMissing || fieldIsEmpty) {
            return {
                missingField: field,
                ok: false,
            }
        }
    }

    return {
        missingField: undefined,
        ok: true,
    }
}
