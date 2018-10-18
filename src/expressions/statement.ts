import { Expression } from './expression';
import { BinaryExpression } from './binaryExpression';
import { conjunction } from './api';
import * as treeify from 'treeify';

export interface StatementProps {
    body: Expression[]
}

export class Statement {
    body: Expression[] = [];

    constructor(props: StatementProps) {
        Object.assign(this, props);
    }

    /**
     * Returns true if all the expressions in the model are primitives.
     */
    get isModel() {
        return this.body.every(expr => expr.isPrimitive);
    }


    /**
     * Creates a conjunction from the body of this Statement.
     */
    merge() {
        const { body } = this;
        if (body.length === 0)
            return null;
        if (body.length === 1)
            return body[0];

        let expr: BinaryExpression;
        let left: Expression;
        let right: Expression;

        for (let i = 1; i < body.length; i++) {

            right = body[i];
            if (i > 1) {
                left = expr;
            } else
                left = body[i - 1];

            expr = conjunction(left, right);
        }

        return expr;
    }

    toTreeString() {
        return treeify.asTree(this, true);
    }
}