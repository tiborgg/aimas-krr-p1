import { expect } from 'chai';
import {
    tokenizeSymbolString,
    operatorToken as operator,
    punctuationToken as punctuation,
    identifierToken as identifier
} from '../symbolTokenizer';


describe('tokenizeSymbolString', () => {

    it('should return the correct list of tokens', () => {

        let tokens = tokenizeSymbolString('not(a & b)');
        expect(tokens.buffer).to.eql([
            operator('negation'),
            punctuation('leftParen'),
            identifier('a'),
            operator('conjunction'),
            identifier('b'),
            punctuation('rightParen')
        ]);
    });
});