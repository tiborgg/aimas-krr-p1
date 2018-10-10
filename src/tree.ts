import * as assert from 'assert';
import { Expression } from './expressions';

export interface NodeProps {
    parent: Node;
    left: Node;
    right: Node;
}

export class Node {

    parent: Node = null;
    left: Node = null;
    right: Node = null;

    expression: Expression = null;

    get isTrunk() {
        return (
            this.left !== null &&
            this.right === null);
    }

    get isLeaf() {
        return (
            this.left === null &&
            this.right === null);
    }

    get isRoot() {
        return this.parent === null;
    }

    get isRightChild() {
        return (
            !this.isRoot &&
            this.parent.right === this);
    }
    get isLeftChild() {
        return (
            !this.isRoot &&
            this.parent.left === this);
    }

    constructor(
        expr: Expression,
        props?: Partial<NodeProps>) {

        this.expression = expr;
        Object.assign(this, props);
    }

    createLeftNode(
        expr: Expression) {

        let node = new Node(expr, {
            parent: this
        });
        this.left = node;
        return node;
    }

    createRightNode(
        expr: Expression) {

        assert(this.left);

        let node = new Node(expr, {
            parent: this
        });
        this.right = node;
        return node;
    }
}