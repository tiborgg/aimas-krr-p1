
import { Token, TokenStream, tokenizeSymbolString } from './symbolTokenizer';
import { Statement, Identifier, Expression, UnaryExpression, BinaryExpression, BinaryOperator, UnaryOperator } from '../../expressions';

function tryParseBinaryExpression(
    stream: TokenStream,
    left: Expression) {

    if (stream.isEof)
        return left;

    let outerExpr = null;
    while (stream.isBinaryOperator()) {

        let operatorToken = stream.current;

        stream.next();
        let right = parseAtom(stream);

        outerExpr = new BinaryExpression({
            operator: operatorToken.value as BinaryOperator,
            left: outerExpr || left,
            right: right
        });

        if (stream.isEof)
            break;
    }

    if (outerExpr)
        return outerExpr;

    return left;
}

function parseAtom(
    stream: TokenStream): Expression {

    if (stream.isPunctuation('leftParen')) {
        stream.next();

        let exp = parseExpression(stream);

        stream.skipPunctuation('rightParen');
        return exp;
    }

    if (stream.isUnaryOperator('negation')) {
        stream.next();
        let exp = parseAtom(stream);
        return new UnaryExpression({
            operator: 'negation',
            operand: exp
        });
    }

    let token = stream.current;
    if (token.type == 'identifier') {
        stream.next();
        return new Identifier({
            name: token.value
        });
    }

    throw new Error('Unexpected token. ');
}

function parseExpression(
    stream: TokenStream) {

    return tryParseBinaryExpression(
        stream,
        parseAtom(stream));
}

function parseSymbolStringTokens(stream: TokenStream) {

    let statement = new Statement();

    while (!stream.isEof) {

        statement.body.push(parseExpression(stream));
        if (!stream.isEof)
            stream.skipPunctuation('comma');
    }

    return statement;
}

export function parseSymbolString(input: string) {

    let tokens = tokenizeSymbolString(input);
    return parseSymbolStringTokens(tokens);
}