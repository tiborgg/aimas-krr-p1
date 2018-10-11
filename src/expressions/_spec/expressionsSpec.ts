import { expect } from 'chai';
import { parseSymbolString } from '../../parsers';
import { isPrimitiveContradiction, isPrimitiveSetCompatible } from '../';

describe('isPrimitiveContradiction', () => {

    const contradictingSet = [
        ['A', '!A'],
        ['!A', 'A']
    ];

    const compatibleSet = [
        ['A', 'A'],
        ['!A', '!A'],
        ['A', 'B']
    ];

    const errorSet = [
        ['A', '!!B'],
        ['A & B', 'C'],
        ['!A', '!B | C']
    ];


    const _expect = (item, res) => {

        return expect(isPrimitiveContradiction(
            parseSymbolString(item[0]).body[0],
            parseSymbolString(item[1]).body[0])).to.equal(res);
    }

    contradictingSet.forEach(item => {

        it(`should return true for contradicting primitive expressions '${item[0]}' and '${item[1]}'`, () => {
            _expect(item, true);
        });
    });

    compatibleSet.forEach(item => {

        it(`should return false for compatible primitive expressions '${item[0]}' and '${item[1]}'`, () => {
            _expect(item, false);
        });
    });

    errorSet.forEach(item => {

        it(`should throw AssertionError for non-primitive expressions '${item[0]}' and '${item[1]}'`, () => {

            expect(() => isPrimitiveContradiction(
                parseSymbolString(item[0]).body[0],
                parseSymbolString(item[1]).body[0])).to.throw;
        });
    });
});



describe('isPrimitiveSetCompatible', () => {

    const contradictingSets = [
        ['A', 'B', '!A'],
        ['A', '!B', 'C', '!A'],
        ['A', 'B', '!B', 'C']
    ];

    const validSets = [
        ['A', 'B', 'C'],
        ['A', '!B', 'C'],
        ['!A', 'B', '!C']
    ];

    const errorSets = [

    ];

    const _expect = (item, res) => {

        return expect(isPrimitiveSetCompatible( 
            item.map(prim => parseSymbolString(prim).body[0]))).to.equal(res);
    }

    contradictingSets.forEach(item => {

        it(`should return false for contradicting primitive expression set '${item.join(', ')}'`, () => {
            _expect(item, false);
        });
    });

    validSets.forEach(item => {

        it(`should return true for compatible primitive expression set '${item.join(', ')}'`, () => {
            _expect(item, true);
        });
    });

    errorSets.forEach(item => {

        it(`should throw AssertionError for non-primitive expression set '${item.join(', ')}'`, () => {

            return expect(() => isPrimitiveSetCompatible( 
                item.map(prim => parseSymbolString(prim).body[0]))).to.throw;
        });
    });
});