import { execSync } from 'child_process'

async function init() {
    if (!process.env.CI) {
        execSync('docker compose up -d --wait postgres-test', {
            stdio: 'inherit',
        })
    }

    execSync('npx prisma db push', { stdio: 'inherit' })
}

export default init