import { expect } from 'chai';
import {
    parseSymbolString,
    parseSymbolStringTokens
} from '../symbolParser';

// utility functions for quickly generating expected ASTs

const expression = (expr) => {
    return typeof expr === 'string' ? identifier(expr) : expr;
}

const identifier = (name) => {
    return {
        type: 'identifier',
        name: name
    }
}

const negation = (operand) => {
    return {
        type: 'unaryExpression',
        operator: 'negation',
        operand: expression(operand)
    }
}

const conjunction = (left, right) => {
    return {
        type: 'binaryExpression',
        operator: 'conjunction',
        left: expression(left),
        right: expression(right)
    }
}

const disjunction = (left, right) => {
    return {
        type: 'binaryExpression',
        operator: 'disjunction',
        left: expression(left),
        right: expression(right)
    }
}

const materialImplication = (left, right) => {
    
    return {
        type: 'binaryExpression',
        operator: 'materialImplication',
        left: expression(left),
        right: expression(right)
    }
}
const converseImplication = (left, right) => {
    
    return {
        type: 'binaryExpression',
        operator: 'converseImplication',
        left: expression(left),
        right: expression(right)
    }
}
const biConditional = (left, right) => {
    
    return {
        type: 'binaryExpression',
        operator: 'biConditional',
        left: expression(left),
        right: expression(right)
    }
}

const formulas = [
    [
        ['A'],
        'A'
    ],

    [
        ['!A', 'not A'],
        negation('A')
    ],

    [
        ['!!A', 'not not A', 'not!A', '!not A'],
        negation(
            negation('A'))
    ],

    [
        ['A & B', 'A and B'],
        conjunction('A', 'B')
    ],

    [
        ['A & !B', 'A and !B', 'A and not B'],
        conjunction(
            'A',
            negation('B')
        )
    ],

    [
        ['A & (B | C)'],
        conjunction(
            'A',
            disjunction('B', 'C'))],

    [
        ['(A)'],
        'A'
    ],

    [
        ['((A))'],
        'A'
    ],

    [
        ['(A & (B | C))'],
        conjunction('A',
            disjunction('B', 'C'))
    ],

    [
        ['(A & B | (C & D))'],
        disjunction(
            conjunction('A', 'B'),
            conjunction('C', 'D')
        )
    ],

    [
        ['!A & !(B | C & !D) | (E & (!!F -> !G))'],
        disjunction(
            conjunction(
                negation('A'),
                negation(
                    conjunction(
                        disjunction('B', 'C'),
                        negation('D'))
                )
            ),
            conjunction(
                'E',
                materialImplication(
                    negation(
                        negation('F')),
                    negation('G')
                )
            )
        )
    ],

    [
        ['A & B, C | D'],
        conjunction('A', 'B')
    ]

]

describe('parseSymbolString', () => {

    describe('correct AST for single statements', () => {

        formulas.forEach(item => {

            let statements: string[] = item[0] as any;
            let expected = expression(item[1]);

            statements.forEach(stat => {

                it(`should return the correct AST for statement '${stat}'`, () => {

                    let ast = parseSymbolString(stat);
                    expect(ast.body[0]).to.deep.include(expected);
                });
            });
        });
    });

    describe('correct AST for multiple statements', () => {

    });
});