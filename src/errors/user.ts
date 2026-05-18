export class EmailAlreadyInUseError extends Error {
    constructor(email: string) {
        super(`The provided e-mail ${email} is already in use.`)
        this.name = 'EmailAlreadyInUseError'
    }
}

export class UserNotFoundError extends Error {
    constructor() {
        super(`User not found.`)
        this.name = 'UserNotFoundError'
    }
}

export class InvalidPasswordError extends Error {
    constructor() {
        super('Invalid password')
        this.name = 'InvalidPasswodError'
    }
}
