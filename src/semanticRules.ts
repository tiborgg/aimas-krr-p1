import * as assert from 'assert';
import { Expression, UnaryExpression, BinaryExpression, createConjunction } from './expressions';
import { BinaryOperator } from './operators';
import { Node } from './tree';

/**
 * Decomposes an expression using the semantic tableaux rules.
 * If the expression is not one of the 9 types defined in the table, the method returns null.
 */
export function expandNode(
    node: Node) {

    assert(node.isLeaf, `You can only call 'expandNode' on a leaf node.`);

    let expr = node.expression;

    if (expr instanceof BinaryExpression) {

        switch (expr.operator) {
            // case 1
            case 'conjunction':
                node.createLeftNode(expr.left)
                    .createLeftNode(expr.right); // chained, left node created on the above left node

            // case 2
            case 'disjunction':
                node.createLeftNode(expr.left)
                node.createRightNode(expr.right);
                break;

            // case 3
            case 'materialImplication':
                node.createLeftNode(expr.left.negate())
                node.createRightNode(expr.right);
                break;

            // case 4
            case 'biConditional':
                node.createLeftNode(createConjunction(expr.left, expr.right))
                node.createRightNode(createConjunction(expr.left.negate(), expr.right.negate()));
                break;
        }

    } else if (expr instanceof UnaryExpression) {

        // temporary assertion, because currently we only support negation as unary operation
        assert(expr.isNegation);

        const { operand: innerExpr } = expr;
        if (innerExpr instanceof UnaryExpression) {

            assert(expr.isDoubleNegation);
            node.createLeftNode(expr.reduce());

        } else if (innerExpr instanceof BinaryExpression) {

            switch (innerExpr.operator) {
                case 'conjunction':
                    node.createLeftNode(innerExpr.left.negate())
                    node.createRightNode(innerExpr.right.negate());
                    break;

                case 'disjunction':
                    node.createLeftNode(innerExpr.left.negate())
                        .createLeftNode(innerExpr.right.negate()); // chain with previous node (trunk)
                    break;

                case 'materialImplication':
                    node.createLeftNode(innerExpr.left)
                        .createLeftNode(innerExpr.right.negate());
                    break;

                case 'biConditional':
                    node.createLeftNode(createConjunction(innerExpr.left, innerExpr.right.negate()));
                    node.createRightNode(createConjunction(innerExpr.left.negate(), innerExpr.right));
                    break;
            }

        }

    } else {
        // no expression
    }
}