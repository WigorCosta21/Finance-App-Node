export interface IPasswordComparatorAdapter {
    execute(password: string, hashedPassword: string): Promise<boolean>
}
