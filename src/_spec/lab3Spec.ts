import { World, world, evalAgainstWorld } from '../modal';
import { Expression, negation, statement, identifier, necessarily, materialImplication, disjunction, evalAgainstModel } from '../expressions';
import { parseSymbolString } from '../parsers';

const worlds = [];

worlds[0] = world(
    statement('D', 'W'), 'W0');

worlds[1] = world(
    statement('D', 'W', negation('C'), 'F', 'B'), 'w0');

worlds[2] = world(
    statement('D', 'W', negation('F'), 'C', 'B'), 'w0');

worlds[3] = world(
    statement('D', 'W', negation('C'), negation('F'), 'B'), 'w0');

worlds[0].connectTo(
    worlds[1],
    worlds[2],
    worlds[3]);


describe('evalAgainstModel', () => {
    // test against task 2 from lab3

    const formulaSymbols = [
        'D -> ( C or B )',
        'W -> ( F or B )',
        'C and F',
        'B'
    ]

    const formulas = formulaSymbols.map(formula => parseSymbolString(formula).body[0]);

    it('check', () => {

        formulas.forEach(formula => {
            worlds.forEach((world, i) => {
                console.log(`${formula} against w${i}: ${evalAgainstModel(formula, worlds[i].statement)}`);
            });
        });
    });
});

describe('lab3', () => {

    it('task2', () => {

        const formulaSymbols = [
            'nec ( D -> ( C or B ))',
            'nec ( W -> ( F or B ))',
            'not pos( C and F )',
            'nec B',
            '(nec B and pos C) <-> (pos B and nec C)'
        ];

        const formulas = formulaSymbols.map(formula => parseSymbolString(formula).body[0]);

        formulas.forEach((formula, i) => {
            console.log(`'${formulaSymbols[i]}' in w0: ${evalAgainstWorld(formulas[i], worlds[0])}`);
        });
    });
});