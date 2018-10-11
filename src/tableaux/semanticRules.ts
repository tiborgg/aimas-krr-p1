import * as assert from 'assert';
import { Expression, UnaryExpression, BinaryExpression, conjunction, negation, Statement } from '../expressions';
import { isPrimitiveSetCompatible } from '../expressions';
import { parseSymbolString, parseTextString } from '../parsers';
import { Node } from './semanticTree';
import * as treeify from 'treeify';

/**
 * Decomposes an expression using the semantic tableaux rules.
 * If the expression is not one of the 9 types defined in the table, the method returns null.
 */
export function expandNode(
    node: Node) {

    assert(node.isLeaf, `You can only call 'expandNode' on a leaf node.`);

    function createUnaryTrunk(
        expr: Expression) {

        node.createLeftNode(expr);
        expandNode(node.left);
    }

    function createBinaryTrunk(
        firstExpr: Expression,
        secondExpr: Expression) {

        // not sure about this, but if the left node is a complex expression, we first expand that
        // and then we attach the right trunk of the expression to each leaf node

        let left = node.createLeftNode(firstExpr);

        expandNode(left);

        left.leaves.forEach(leaf => {
            leaf.createLeftNode(secondExpr);
            expandNode(leaf.left);
        });
    }

    function createBinaryBranching(
        leftExpr: Expression,
        secondExpr: Expression) {

        node.createLeftNode(leftExpr);
        node.createRightNode(secondExpr);

        expandNode(node.left);
        expandNode(node.right);
    }

    let expr = node.expression;
    if (expr instanceof BinaryExpression) {

        switch (expr.operator) {

            // case 1
            case 'conjunction': {
                createBinaryTrunk(
                    expr.left,
                    expr.right);
            } break;

            // case 2
            case 'disjunction':
                createBinaryBranching(
                    expr.left,
                    expr.right);
                break;

            // case 3
            case 'materialImplication':
                createBinaryBranching(
                    negation(expr.left),
                    expr.right);
                break;

            // case 4
            case 'biConditional':
                createBinaryBranching(
                    conjunction(expr.left, expr.right),
                    conjunction(
                        negation(expr.left),
                        negation(expr.right)));
                break;
        }

    } else if (expr instanceof UnaryExpression) {

        // temporary assertion, because currently we only support negation as unary operation
        assert(expr.isNegation);

        const { operand: innerExpr } = expr;
        if (innerExpr instanceof UnaryExpression) {

            if (expr.isDoubleNegation) {
                createUnaryTrunk(expr.reduce());
            } else {
                // the node is a simple negation and we leave it like this
                assert(expr.isPrimitive);
            }

        } else if (innerExpr instanceof BinaryExpression) {

            switch (innerExpr.operator) {
                case 'conjunction':
                    createBinaryBranching(
                        negation(innerExpr.left),
                        negation(innerExpr.right));
                    break;

                case 'disjunction':
                    createBinaryTrunk(
                        negation(innerExpr.left),
                        negation(innerExpr.right));
                    break;

                case 'materialImplication': {
                    createBinaryTrunk(
                        innerExpr.left,
                        negation(innerExpr.right));
                } break;

                case 'biConditional':
                    createBinaryBranching(
                        conjunction(
                            innerExpr.left,
                            negation(innerExpr.right)),
                        conjunction(
                            negation(innerExpr.left),
                            innerExpr.right));
                    break;
            }
        }

    } else {
        // identifier, or no expression, stop here
        assert(expr.isPrimitive);
    }
}

export function getModelsForStatement(
    statement: Statement) {

    // merge the statement so that we get a conjunction between all expressions in the statement
    let expr = statement.merge();

    // create a root node from the merged expression, that we'll expand
    let root = new Node(expr);
    expandNode(root);

    // check the resulting leaf nodes of the group for contradictions
    const { leaves } = root;

    let solutions: string[][] = [];
    leaves.forEach(leaf => {

        const primitives = leaf.primitives.map(node => node.expression);

        if (isPrimitiveSetCompatible(primitives)) {

            let identifiers = [];
            solutions.push(primitives
                .map(expr => {

                    let id = expr.identifiers[0];
                    if (identifiers.indexOf(id) !== -1)
                        return null;

                    identifiers.push(id);
                    
                    switch (expr.type) {
                        case 'identifier':
                            return `${id} = True`;
                        case 'unaryExpression':
                            return `${id} = False`;
                    }
                })
                .filter(x => x)); // filter out duplicates that were ignored
        }
    });

    return solutions;
}

export function getModelsForSymbolString(input: string) {

    let stat = parseSymbolString(input);
    return getModelsForStatement(stat);
}

export function getModelsForTextString(input: string) {

    let stat = parseTextString(input);
    return getModelsForStatement(stat);
}