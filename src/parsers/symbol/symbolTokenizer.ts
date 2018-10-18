import * as _ from 'lodash';
import * as assert from 'assert';
import * as Lexer from 'lex';
import { Operator, UnaryOperator, BinaryOperator } from '../../expressions';

const UnaryOperators = [
    'negation',
    'necessarily',
    'possibly'];

const BinaryOperators = [
    'disjunction',
    'conjunction',
    'materialImplication',
    'converseImplication',
    'biConditional'
];

export type TokenType =
    'punctuation' |
    'operator' |
    'identifier';

export type PunctuationTokenValue =
    'leftParen' |
    'rightParen' |
    'comma';

export type OperatorTokenValue =
    'negation' |
    'necessarily' |
    'possibly' |
    'disjunction' |
    'conjunction' |
    'materialImplication' |
    'converseImplication' |
    'biConditional';

export interface Token {
    type: TokenType;
    value: string;
}

export function operatorToken(
    value: OperatorTokenValue): Token {
    return {
        type: 'operator',
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

export function identifierToken(
    value: string) {
    return {
        type: 'identifier',
        value
    }
}

let row = 1;
let col = 1;

let lexer = new Lexer(function (char) {
    throw new Error("Unexpected character at row " + row + ", col " + col + ": " + char);
});

lexer.addRule(/\s/i, function (lexeme) {
    //return 'WHITESPACE';
});

lexer.addRule(/not|~|!/i,
    token => operatorToken('negation'));

lexer.addRule(/|nec/i,
    token => operatorToken('necessarily'));

lexer.addRule(/◇|pos/i,
    token => operatorToken('possibly'));

lexer.addRule(/∨|or|\|/i,
    token => operatorToken('disjunction'));

lexer.addRule(/∧|and|&/i,
    token => operatorToken('conjunction'));

lexer.addRule(/→|->/i,
    token => operatorToken('materialImplication'));

lexer.addRule(/←|<-/i,
    token => operatorToken('converseImplication'));

lexer.addRule(/↔|<>|<->/i,
    token => operatorToken('biConditional'));

lexer.addRule(/[\(\),]/i,
    token => {
        switch (token) {
            case '(': return punctuationToken('leftParen');
            case ')': return punctuationToken('rightParen');
            case ',': return punctuationToken('comma');
        }
    });

lexer.addRule(/[\w\d]+/i,
    token => identifierToken(token));

function isUnaryOperator(token: Token) {
    return (
        token.type === 'operator' &&
        _.includes(UnaryOperators, token.value));
}

function isBinaryOperator(token: Token) {
    return (
        token.type === 'operator' &&
        _.includes(BinaryOperators, token.value));
}


// lexer.addRule(/\n/, () => {
//     row++;
//     col = 1;
// }, []);

lexer.addRule(/./, () => {
    this.reject = true;
    col++;
}, []);


export function tokenizeSymbolString(input: string) {

    lexer.setInput(input);

    let tokens = [];
    while (lexer.index < input.length) {
        let token = lexer.lex();
        if (token)
            tokens.push(token);
    }

    return new TokenStream(tokens);
}

export class TokenStream {

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

    isPunctuation(value) {
        const curr = this.current;
        return (
            curr.type === 'punctuation' &&
            curr.value === value);
    }

    skipPunctuation(value?: PunctuationTokenValue) {
        return this.skip({
            type: 'punctuation',
            value
        });
    }

    isOperator(value?: Operator) {

        const curr = this.current;
        return (
            curr.type === 'operator' &&
            (value ? curr.value === value : true));
    }

    isUnaryOperator(value?: UnaryOperator) {

        const curr = this.current;
        return (
            isUnaryOperator(curr) &&
            this.isOperator(value));
    }

    isBinaryOperator(value?: BinaryOperator) {

        const curr = this.current;
        return (
            isBinaryOperator(curr) &&
            this.isOperator(value));
    }

    isIdentifier(value: string) {
        const curr = this.current;
        return (
            curr.type === 'identifier' &&
            curr.value === name);
    }
}