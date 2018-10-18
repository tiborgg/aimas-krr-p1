import * as assert from 'assert';
import * as _ from 'lodash';
import { Statement } from '../expressions';

export interface WorldProps {
    statement: Statement,
    name: string
}

export class World {

    readonly statement: Statement;
    readonly name: string;

    readonly adjacentWorlds: World[] = [];

    constructor(props: WorldProps) {
        Object.assign(this, props);
    }

    /**
     * Adds the provided World to the adjancency list of the current World.
     * If the parameter is a Statement, a new World is created for it.
     * @returns The provided parameter if it was a World, or the newly created World for the provided statement
     */
    connectTo(...worlds: World[]): this {

        const adjWorlds = this.adjacentWorlds;
        worlds.forEach(world => {
            assert(!adjWorlds.includes(world));
            adjWorlds.push(world);
        });

        return this;
    }

}