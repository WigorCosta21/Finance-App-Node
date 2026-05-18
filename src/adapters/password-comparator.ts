import bcrypt from 'bcrypt'
import type { IPasswordComparatorAdapter } from './interfaces/password-comparator.js'

export class PasswordComparatorAdapter implements IPasswordComparatorAdapter {
    async execute(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword)
    }
}
