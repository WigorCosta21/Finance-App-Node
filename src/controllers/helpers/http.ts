export const badRequest = (body: unknown) => {
    return {
        statusCode: 400,
        body,
    }
}

export const unauthorized = () => {
    return {
        statusCode: 401,
        body: {
            message: 'Unauthorized',
        },
    }
}

export const created = (body: unknown) => {
    return {
        statusCode: 201,
        body,
    }
}

export const serverError = () => {
    return {
        statusCode: 500,
        body: {
            errorMessage: 'Internal server error',
        },
    }
}

export const ok = (body: unknown) => {
    return {
        statusCode: 200,
        body,
    }
}

export const notFound = (body: unknown) => {
    return {
        statusCode: 404,
        body,
    }
}
