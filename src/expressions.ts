import { UnaryOperator, BinaryOperator } from './operators';

export class Statement {
    body: Expression[] = [];
}

export enum ExpressionArity {
    Unary,
    Binary
}


export function createNegation(operand: Expression) {
    return new UnaryExpression({
        operator: 'negation',
        operand: operand
    });
}

export function createConjunction(
    left: Expression,
    right: Expression) {
    return new BinaryExpression({
        operator: 'conjunction',
        left,
        right
    });
}

export function createDisjunction(
    left: Expression,
    right: Expression) {
    return new BinaryExpression({
        operator: 'disjunction',
        left,
        right
    });
}

export type ExpressionType =
    'identifier' |
    'unaryExpression' |
    'binaryExpression';

export abstract class Expression {

    type: ExpressionType;

    /**
     * Returns a new expression that is the negation of the current one.
     */
    negate() {
        return createNegation(this);
    }

    disjoinLeftWith() {

    }
    conjoinLeftWith() {

    }
}



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

    get isDoubleNegation() {
        return (
            this.isNegation &&
            (this.operand instanceof UnaryExpression) &&
            this.operand.isNegation);
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



export interface BinaryExpressionProps {
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
}

export class BinaryExpression
    extends Expression {

    readonly type = 'binaryExpression';

    operator: BinaryOperator;
    left: Expression;
    right: Expression;

    constructor(
        props: BinaryExpressionProps) {
        super();

        Object.assign(this, props);
    }
}

export interface IdentifierProps {
    name: string
}

export class Identifier
    extends Expression {

    readonly type = 'identifier';

    name: string;

    constructor(
        props: IdentifierProps) {
        super();
        Object.assign(this, props);
    }
}