import { Statement } from '../expressions';
import { World } from './kripke';

export function world(statement: Statement, name: string) {
    return new World({
        statement,
        name
    });
}