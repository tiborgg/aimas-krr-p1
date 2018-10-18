import { expect } from 'chai';
import { parseSymbolString } from '../symbolParser';
import { expression, negation, necessarily, possibly, conjunction, disjunction, materialImplication, biConditional } from '../../../expressions';

const singleFormulas = [
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
    ],

    // #region Modal formulas
    [
        ['(B & ◇C) ↔ (◇B & C)'],
        biConditional(
            conjunction(
                necessarily('B'),
                possibly('C')),
            conjunction(
                possibly('B'),
                necessarily('C')
            ))
    ]
    // #endregion
]

const multiFormulas = [

    [
        ['A & B, C -> D'],
        [
            conjunction('A', 'B'),
            materialImplication('C', 'D')
        ]
    ]
]

describe('parseSymbolString', () => {

    describe('correct AST for single statements', () => {

        singleFormulas.forEach(item => {

            let statements: string[] = item[0] as any;
            let expected = expression(item[1]);

            statements.forEach(stat => {

                it(`should return the correct AST for statement '${stat}'`, () => {

                    let ast = parseSymbolString(stat);
                    expect(ast.body[0]).to.deep.equal(expected);
                });
            });
        });
    });

    describe('correct AST for multiple statements', () => {
        multiFormulas.forEach(item => {

            let statements: string[] = item[0] as any;
            let expected = expression(item[1]);

            statements.forEach(stat => {

                it(`should return the correct AST for statement '${stat}'`, () => {

                    let ast = parseSymbolString(stat);
                    expect(ast.body).to.deep.equal(expected);
                });
            });
        });
    });

    describe('correct AST for multiple modal statements', () => {

    });
});