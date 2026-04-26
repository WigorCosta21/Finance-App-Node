import { prisma } from './prisma/prisma.js'

beforeEach(async () => {
    await prisma.transaction.deleteMany({})
    await prisma.user.deleteMany({})
})

afterAll(async () => {
    await prisma.$disconnect()
})
