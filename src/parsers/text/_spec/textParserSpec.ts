import { expect } from 'chai';
import { parseTextString } from '../textParser';
import { expression, negation, conjunction, disjunction, materialImplication, biConditional, identifier } from '../../../expressions';

describe('parseTextString', () => {

    describe('tasks for lab 2', () => {
        it('should return correct AST for proposition 1', () => {

            let ast = parseTextString('Alfred go to party or Beth go to party');

            expect(ast.body[0]).to.deep.equal(
                disjunction('Alfred', 'Beth'));
        });

        it('should return correct AST for proposition 2', () => {

            let ast = parseTextString('If Beth go to party then Clare go to party iff not Daniel go to party');

            expect(ast.body[0]).to.deep.equal(
                materialImplication(
                    'Beth',
                    biConditional(negation('Daniel'), 'Clare'))
            );
        });

        it('should return correct AST for proposition 3', () => {

            let ast = parseTextString('Daniel go to party iff not Alfred go to party');
            expect(ast.body[0]).to.deep.equal(
                biConditional(
                    negation('Alfred'),
                    'Daniel')
            );
        });

        it('should return correct AST for proposition 4', () => {

            let ast = parseTextString('Clare go to party');
            expect(ast.body[0]).to.deep.equal(
                identifier('Clare'));
        });
    });

    
});