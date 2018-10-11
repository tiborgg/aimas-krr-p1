import { expect } from 'chai';
import { getModelsForSymbolString } from '../';

describe('getModelForSymbolString', () => {

    it('should return the correct model for A & B', () => {
        let model = getModelsForSymbolString('A & B');
        expect(model[0]).to.have.deep.members([
            'A = True',
            'B = True'
        ]);
    });

    // EXAMPLE P1
    let p1formula = 'p->q, q->r, !(p->r)';
    it(`should return false for unsatisfiable model '${p1formula}'`, () => {

        let model = getModelsForSymbolString(p1formula);
        expect(model.length).to.equal(0);
    });

    // EXAMPLE P2
    let p2formula = '!((A1 -> A2) & (A3 | !(A3 | !A1)))'
    it(`should return the correct model for satisfiable formula '${p2formula}'`, () => {

        let model = getModelsForSymbolString(p2formula);

        console.log(model);

        // expect(model).to.have.deep.members([
        //     [
        //         'A2 = False',
        //         'A1 = True'
        //     ]
        // ]);
    });


    // TASK 2
    let t2formula = 'A | B, B -> (!D <> C), !A <> D, C';

    it(`should return the correct model for satisfiable formula '${t2formula}'`, () => {

        let model = getModelsForSymbolString(t2formula);

        console.log(model);

        // expect(model).to.have.deep.members([
        //     [
        //         'A '
        //     ]
        // ]);
    });
});