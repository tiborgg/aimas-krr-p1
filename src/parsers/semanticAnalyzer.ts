
import { Statement, Expression, BinaryExpression, UnaryExpression } from '../expressions';
import { parseSymbolString } from './symbol';

export function analyzeExpression(
    expr: Expression) {

    let depth = 0;
    let implicationOperatorCount = 0;

    function walk(expr: Expression) {

        switch (expr.type) {
            case 'identifier':
                break;

            case 'binaryExpression':
                let binaryExpr = (expr as BinaryExpression);
                switch (binaryExpr.operator) {
                    case 'materialImplication':
                    case 'converseImplication':
                    case 'biConditional':

                        if (depth !== 0)
                            throw new Error('Syntax error. You can only have one implication operator per formula and it must be at the root level of your formula.');

                        if (implicationOperatorCount > 0)
                            throw new Error('Syntax error. You can only have one implication operator per formula.');

                        implicationOperatorCount++;
                        break;
                }

                depth++;
                walk(binaryExpr.left);
                walk(binaryExpr.right);
                depth--;
                break;

            case 'unaryExpression':
                let unaryExpr = (expr as UnaryExpression);
                depth++;
                walk(unaryExpr.operand);
                depth--;
                break;
        }
    }

    walk(expr);
}

export function analyzeParseTree(
    statement: Statement) {

    statement.body.forEach(expr => {
        analyzeExpression(expr);
    });
}

export function analyzeSymbolString(
    input: string) {

    let statement = parseSymbolString(input);
    analyzeParseTree(statement);

    return true;
}