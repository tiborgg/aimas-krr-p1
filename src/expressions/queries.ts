import * as assert from 'assert';
import { Expression } from './expression';
import { UnaryExpression } from './unaryExpression';
import { Statement } from './statement';
import { BinaryExpression } from '~/expressions/binaryExpression';

/**
 * Current
 */
export function isPrimitiveContradiction(expr1: Expression, expr2: Expression) {

    assert(
        expr1.isPrimitive &&
        expr2.isPrimitive,
        `Function 'isPrimitiveContradiction' can only be called on primitive expressions.`);

    // primitive expressions should have exactly one identifier
    let name1 = expr1.identifiers[0];
    let name2 = expr2.identifiers[0];

    // if the identifiers are different, we don't have a contradiction
    if (name1 !== name2)
        return false;

    switch (expr1.type) {
        case 'identifier':
            switch (expr2.type) {
                case 'identifier': return false; // A, A, compatible
                case 'unaryExpression': {
                    assert((expr2 as UnaryExpression).isSimpleNegation);
                    return true; // A, !A, contradiction
                }
            }
            break;

        case 'unaryExpression':
            assert((expr1 as UnaryExpression).isSimpleNegation);

            switch (expr2.type) {
                case 'identifier': return true; // !A, A, contradiction
                case 'unaryExpression': {
                    assert((expr2 as UnaryExpression).isSimpleNegation);
                    return false; // !A, !A, compatible
                }
            }
            break;
    }

    return false;
}

export function isPrimitiveSetCompatible(primitives: Expression[]) {

    let contr = false;
    primitives.forEach(prim1 => {
        assert(prim1.isPrimitive);

        primitives.forEach(prim2 => {
            assert(prim2.isPrimitive);

            if (isPrimitiveContradiction(prim1, prim2)) {
                contr = true;
                return false; // exit foreach callback
            }
        });

        if (contr)
            return false; // exit foreach callback
    });

    return !contr;
}

export function isPrimitiveCompatibleWithModel(primitiveExpr: Expression, model: Statement) {

    if (!primitiveExpr.isPrimitive)
        throw new Error();

    assert(primitiveExpr.isPrimitive, 'Expression is not primitive');
    return isPrimitiveSetCompatible(model.body.concat([primitiveExpr]));
}


export function evalAgainstModel(
    expr: Expression,
    model: Statement): boolean {

    assert(model.isModel, `The second parameter provided to 'evalAgainstModel' is not a model (i.e. it contains non-primitive expressions).`);

    switch (expr.type) {

        case 'identifier':
            return isPrimitiveCompatibleWithModel(expr, model);

        case 'unaryExpression':
            let unaryExpr = expr as UnaryExpression;
            switch (unaryExpr.operator) {
                case 'negation':
                    if (unaryExpr.isPrimitive)
                        return isPrimitiveCompatibleWithModel(unaryExpr, model);
            }

            break;

        case 'binaryExpression':
            let binaryExpr = expr as BinaryExpression;

            let leftComp = evalAgainstModel(binaryExpr.left, model);
            let rightComp = evalAgainstModel(binaryExpr.right, model);

            switch (binaryExpr.operator) {
                case 'materialImplication':
                    return (leftComp ? rightComp : true);

                case 'biConditional':
                    return (
                        (leftComp && rightComp) ||
                        (!leftComp && !rightComp));

                case 'conjunction':
                    return leftComp && rightComp;

                case 'disjunction':
                    return leftComp || rightComp;
            }
            break;
    }
}