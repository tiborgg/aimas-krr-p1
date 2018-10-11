import { Expression } from './expression';

export interface IdentifierProps {
    name: string
}

export class Identifier
    extends Expression {

    readonly type = 'identifier';
    readonly isPrimitive = true;

    name: string;

    get identifiers() {
        return [this.name];
    }

    constructor(
        props: IdentifierProps) {
        super();
        Object.assign(this, props);
    }
}