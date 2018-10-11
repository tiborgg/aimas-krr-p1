import * as assert from 'assert';
import * as treeify from 'treeify';

export type ExpressionType =
    'identifier' |
    'unaryExpression' |
    'binaryExpression';

export abstract class Expression {

    readonly isPrimitive: boolean;
    readonly identifiers: string[];

    type: ExpressionType;
    
    toTreeString() {
        return treeify.asTree(this, true);
    }
}