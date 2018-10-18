export type BasicUnaryOperator =
    'negation';

export type ModalUnaryOperator =
    'necessarily' |
    'possibly';

export type UnaryOperator =
    BasicUnaryOperator |
    ModalUnaryOperator;


    
export type BinaryOperator =
    'disjunction' |
    'conjunction' |
    'materialImplication' |
    'converseImplication' |
    'biConditional';

export type Operator = UnaryOperator | BinaryOperator;

export const OperatorPrecedence = {
    'materialImplication': 1,
    'converseImplication': 1,
    'biConditional': 1,
    'disjunction': 2,
    'conjunction': 2,
    'negation': 3
}

export function getOperatorSymbol(
    operator: Operator) {

    switch (operator) {
        case 'negation': return '¬';
        case 'conjunction': return '∧';
        case 'disjunction': return '∨';
        case 'materialImplication': return '→';
        case 'converseImplication': return '←';
        case 'biConditional': return '↔';
    }
}