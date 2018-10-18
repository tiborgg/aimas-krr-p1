import { statement, Expression, UnaryExpression, BinaryExpression, Identifier, evalAgainstModel, isPrimitiveCompatibleWithModel } from '../expressions';
import { getModelsForStatement } from '../tableaux'
import { World } from './kripke';

export function isModalExpressionValidInWorld(expr: UnaryExpression, world: World) {

    switch (expr.operator) {

        case 'necessarily':

            // assert that the operand is true in all directly connected worlds
            return world.adjacentWorlds.every(adjWorld => evalAgainstModel(expr.operand, world.statement));

        case 'possibly':

            // assert that the operand is true in at least one directly connected world
            return world.adjacentWorlds.some(adjWorld => evalAgainstModel(expr.operand, world.statement));
    }

    console.error('Not implemented');
}


export function evalAgainstWorld(expr: Expression, world: World) {

    switch (expr.type) {

        case 'identifier':
            return isPrimitiveCompatibleWithModel(expr, world.statement);

        case 'unaryExpression':
            let unaryExpr = expr as UnaryExpression;
            switch (unaryExpr.operator) {
                case 'negation':
                    if (unaryExpr.isPrimitive)
                        return isPrimitiveCompatibleWithModel(unaryExpr, world.statement);
                    else
                        return !evalAgainstWorld(unaryExpr.operand, world);

                case 'necessarily':
                // length 0 check
                    return world.adjacentWorlds.every(adjWorld => evalAgainstWorld(unaryExpr.operand, adjWorld));

                case 'possibly':
                    return world.adjacentWorlds.some(adjWorld => evalAgainstWorld(unaryExpr.operand, adjWorld));
            }

            break;

        case 'binaryExpression':
            let binaryExpr = expr as BinaryExpression;

            let leftComp = evalAgainstWorld(binaryExpr.left, world);
            let rightComp = evalAgainstWorld(binaryExpr.right, world);

            switch (binaryExpr.operator) {
                case 'materialImplication':
                    return (leftComp ? rightComp : true);

                case 'biConditional':
                    return (
                        (leftComp && rightComp) ||
                        (!leftComp && !rightComp));

                case 'conjunction':
                    return leftComp && rightComp;

                case 'disjunction':
                    return leftComp || rightComp;
            }
            break;
    }
}