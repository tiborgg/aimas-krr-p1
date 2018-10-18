import { Identifier } from './identifier';
import { BinaryExpression } from './binaryExpression';
import { UnaryExpression } from './unaryExpression';

export function expression(expr) {
    return typeof expr === 'string' ? identifier(expr) : expr;
}

export function identifier(name) {
    return new Identifier({
        name: name
    });
}

export function negation(operand) {
    return new UnaryExpression({
        operator: 'negation',
        operand: expression(operand)
    });
}

export function possibly(operand) {
    return new UnaryExpression({
        operator: 'possibly',
        operand: expression(operand)
    });
}

export function necessarily(operand) {
    return new UnaryExpression({
        operator: 'necessarily',
        operand: expression(operand)
    });
}

export function conjunction(left, right) {
    return new BinaryExpression({
        operator: 'conjunction',
        left: expression(left),
        right: expression(right)
    });
}

export function disjunction(left, right) {
    return new BinaryExpression({
        operator: 'disjunction',
        left: expression(left),
        right: expression(right)
    });
}

export function materialImplication(left, right) {

    return new BinaryExpression({
        operator: 'materialImplication',
        left: expression(left),
        right: expression(right)
    });
}

export function converseImplication(left, right) {

    return new BinaryExpression({
        operator: 'converseImplication',
        left: expression(left),
        right: expression(right)
    });
}

export function biConditional(left, right) {

    return new BinaryExpression({
        operator: 'biConditional',
        left: expression(left),
        right: expression(right)
    });
}