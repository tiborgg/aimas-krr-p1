import { Expression } from './expression';
import { BinaryOperator } from './operators';

export interface BinaryExpressionProps {
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
}

export class BinaryExpression
    extends Expression {

    readonly type = 'binaryExpression';
    readonly isPrimitive = false;

    operator: BinaryOperator;
    left: Expression;
    right: Expression;

    get identifiers() {
        return ([]
            .concat(this.left.identifiers)
            .concat(this.right.identifiers));
    }

    constructor(
        props: BinaryExpressionProps) {
        super();

        Object.assign(this, props);
    }

    /** 
     * Currently only implemented for primitives.
     */
    isCompatibleWith(expr: Expression) {
        return false;
    }
}