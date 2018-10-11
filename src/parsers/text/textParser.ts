import { TextTokenStream, tokenizeTextString } from './textTokenizer';
import { Statement, Expression, BinaryExpression, BinaryOperator, identifier, materialImplication, negation } from '../../expressions';

function tryParseBinaryExpression(
    stream: TextTokenStream,
    left: Expression) {

    if (stream.isEof)
        return left;

    if (stream.isKeyword('or') ||
        stream.isKeyword('and') ||
        stream.isKeyword('iff')) {

        let keywordToken = stream.current;

        stream.next();
        let right = parseAtom(stream);

        let operator = (() => {
            switch (keywordToken.value) {
                case 'iff': return 'biConditional';
                case 'or': return 'disjunction';
                case 'and': return 'conjunction';
            }
        })();

        if (keywordToken.value === 'iff') {
            let temp = right;
            right = left;
            left = temp;
        }

        return new BinaryExpression({
            operator: operator as any,
            left: left,
            right: right
        });
    }

    return left;
}

function parseAtom(
    stream: TextTokenStream) {

    if (stream.isKeyword('if')) {

        stream.next();

        let left = parseExpression(stream);

        stream.skipKeyword('then');

        let right = parseExpression(stream);

        return materialImplication(left, right);
    }

    if (stream.isKeyword('not')) {
        stream.next();
        return negation(parseAtom(stream));
    }

    if (stream.isIdentifier()) {
        let name = stream.current.value;
        stream.next();
        return identifier(name);
    }

    // TEMP
    console.log(stream.current.value);
    throw new Error('Unexpected token. ');
}

function parseExpression(
    stream: TextTokenStream) {

    return tryParseBinaryExpression(
        stream,
        parseAtom(stream));
}

function parseTextStringTokens(stream: TextTokenStream) {

    let statement = new Statement();

    while (!stream.isEof) {

        statement.body.push(parseExpression(stream));
        // if (!stream.isEof)
        //     stream.skipPunctuation('comma');
    }

    return statement;
}

export function parseTextString(input: string) {

    let tokens = tokenizeTextString(input);
    return parseTextStringTokens(tokens);
}