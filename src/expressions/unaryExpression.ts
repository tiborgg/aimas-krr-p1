import { Expression } from './expression';
import { UnaryOperator } from './operators';

export interface UnaryExpressionProps {
    operator: UnaryOperator;
    operand: Expression;
}

export class UnaryExpression
    extends Expression {

    readonly type = 'unaryExpression';

    operator: UnaryOperator;
    operand: Expression;

    /**
     * Get if the current UnaryExpression is a negation.
     * Currently this is redundant since the only supported unary operator is negation.
     */
    get isNegation() {
        return this.operator === 'negation';
    }

    /**
     * Returns true if the current UnaryExpression is a single negation of an identifier.
     */
    get isSimpleNegation() {
        return (
            this.isNegation && (
                this.operand.type !== 'unaryExpression' ||
                !(this.operand as UnaryExpression).isNegation));
    }

    get isDoubleNegation() {
        return (
            this.isNegation &&
            (this.operand instanceof UnaryExpression) &&
            this.operand.isNegation);
    }

    get isPrimitive() {
        return this.isNegation && (this.operand.type === 'identifier');
    }

    get identifiers() {
        return this.operand.identifiers;
    }

    constructor(
        props: UnaryExpressionProps) {
        super();

        Object.assign(this, props);
    }

    reduce() {
        if (this.isDoubleNegation)
            return (this.operand as UnaryExpression).operand;
        return this;
    }
}
