import { v4 as uuid } from 'uuid'

export class IdGeneratorAdapter {
    execute() {
        return uuid()
    }
}
