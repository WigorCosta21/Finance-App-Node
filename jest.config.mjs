import { createDefaultEsmPreset } from 'ts-jest'

const presetConfig = createDefaultEsmPreset({
    tsconfig: 'tsconfig.json',
})

/** @type {import('jest').Config} */
export default {
    ...presetConfig,
    bail: true,
    clearMocks: true,
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.ts'],
    globalSetup: '<rootDir>/jest.global-setup.mjs',
    setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.ts'],
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@prisma/generated/client$': '<rootDir>/prisma/generated/client.ts',
        '^@prisma/generated/enums$': '<rootDir>/prisma/generated/enums.ts',
        '^@prisma/generated/(.*)$': '<rootDir>/prisma/generated/$1',
    },
}
