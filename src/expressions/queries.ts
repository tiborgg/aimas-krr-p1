import * as assert from 'assert';
import { Expression } from './expression';
import { UnaryExpression } from './unaryExpression';

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