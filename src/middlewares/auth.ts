import { type RequestHandler } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'

export const auth: RequestHandler = (request, response, next) => {
    try {
        const accessToken = request.headers.authorization?.split('Bearer ')[1]

        if (!accessToken) {
            return response.status(401).send({ message: 'Unathorized' })
        }

        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET as string,
        ) as JwtPayload & { userId: string }

        if (!decodedToken) {
            return response.status(401).send({ message: 'Unathorized' })
        }

        request.userId = decodedToken.userId

        console.log('auth middleware ir running')

        next()
    } catch (error) {
        console.error(error)

        return response.status(401).send({ message: 'Unathorized' })
    }
}
