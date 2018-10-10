import { analyzeParseTree, analyzeSymbolString } from '../semanticAnalyzer';
import { expect } from 'chai';

describe('analyzeParseTree', () => {

    it('should return true for valid statements', () => {
        
        expect(() => analyzeSymbolString('B -> C')).not.to.throw;
        expect(() => analyzeSymbolString('B & A -> C & D')).not.to.throw;
    });

    it('should throw an error for wrongly-placed implication operators', () => {

        expect(() => analyzeSymbolString('A & (B -> C)')).to.throw;
    });
});