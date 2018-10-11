import * as assert from 'assert';
import * as Lexer from 'lex';
import { Operator, UnaryOperator, BinaryOperator } from '../../expressions';

export type TokenType =
    'keyword' |
    'identifier' |
    'punctuation';

export type KeywordTokenValue =
    'not' |
    'or' |
    'and' |
    'if' |
    'then' |
    'iff';

export type PunctuationTokenValue =
    'comma';

export interface Token {
    type: TokenType;
    value: string;
}

export function identifierToken(
    value: string) {
    return {
        type: 'identifier',
        value
    }
}

export function keywordToken(
    value: KeywordTokenValue): Token {
    return {
        type: 'keyword',
        value
    };
}

export function punctuationToken(
    value: PunctuationTokenValue): Token {
    return {
        type: 'punctuation',
        value
    };
}

let row = 1;
let col = 1;

let lexer = new Lexer(function (char) {
    throw new Error("Unexpected character at row " + row + ", col " + col + ": " + char);
});

lexer.addRule(/\s/i, function (lexeme) {
    //return 'WHITESPACE';
});

// PUNCTUATION

lexer.addRule(/,/i,
    token => punctuationToken('comma'));

// OPERATORS

lexer.addRule(/not/i,
    token => keywordToken('not'));

lexer.addRule(/or|\|/i,
    token => keywordToken('or'));

lexer.addRule(/and|&/i,
    token => keywordToken('and'));

lexer.addRule(/if/i,
    token => keywordToken('if'));

lexer.addRule(/then/i,
    token => keywordToken('then'));

lexer.addRule(/iff/i,
    token => keywordToken('iff'));

// SUBJECTS

lexer.addRule(/([\w\d]+) go to party/i,
    (_, token) => identifierToken(token));


// lexer.addRule(/\n/, () => {
//     row++;
//     col = 1;
// }, []);

lexer.addRule(/./, () => {
    this.reject = true;
    col++;
}, []);


export function tokenizeTextString(input: string) {

    lexer.setInput(input);

    let tokens = [];
    while (lexer.index < input.length) {
        let token = lexer.lex();
        if (token)
            tokens.push(token);
    }

    return new TextTokenStream(tokens);
}





export class TextTokenStream {

    currentIndex: number = 0;
    readonly buffer: Token[] = [];

    constructor(tokens: Token[]) {
        this.buffer = tokens;
    }

    get current() {
        return this.buffer[this.currentIndex];
    }

    get isEof() {
        return this.currentIndex >= this.buffer.length;
    }

    next() {
        this.currentIndex++;
        return this.current;
    }

    peek() {
        return this.buffer[this.currentIndex + 1] || null;
    }

    /**
     * Asserts that the current token matches the provided token, and skips it.
     */
    skip(token: Token) {
        
        const curr = this.current;
        if (curr.type === token.type &&
            curr.value === token.value) {
            return this.next();
        }

        throw new Error(`Unexpected token. Expected '${token.value}'.`);
    }


    isKeyword(value?: KeywordTokenValue) {
        const curr = this.current;
        return (
            curr.type === 'keyword' &&
            (value ? curr.value === value : true));
    }

    skipKeyword(value?: KeywordTokenValue) {
        return this.skip({
            type: 'keyword',
            value
        });
    }



    isIdentifier(value?: string) {
        const curr = this.current;
        return (
            curr.type === 'identifier' &&
            (value ? curr.value === value : true));
    }

    skipIdentifier(value?: string) {
        return this.skip({
            type: 'identifier',
            value
        });
    }


    isPunctuation(value?: PunctuationTokenValue) {
        const curr = this.current;
        return (
            curr.type === 'punctuation' &&
            (value ? curr.value === value : true));
    }

    skipPunctuation(value?: PunctuationTokenValue) {
        return this.skip({
            type: 'punctuation',
            value
        });
    }
}