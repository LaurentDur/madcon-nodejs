import Entity from "./entity.mjs";
import { ORGANISATIONS } from "./game.mjs";
import Visitor from "./visitor.mjs";


export default class Board extends Entity {

    private _cells: { queue: Visitor[], entrance: Visitor[], organisations: {ref: ORGANISATIONS, visitors: Visitor[]}[] } = {queue: [], entrance: [], organisations: []}
    private _visitors: Visitor[] = []

    constructor() {
        super()
    }

    reset(): void {
        // Remove visitors
        this._visitors.forEach(n => n.reset())
        this._visitors.length = 0

        const organisations:{ref: ORGANISATIONS, visitors: Visitor[]}[] = Object.keys(ORGANISATIONS).map( o => { return {ref: o as ORGANISATIONS, visitors: []}})
        this._cells = {queue: [], entrance: [], organisations}

    }

    /**
     * Add new visitor, and place it in queue line
     * @param visitor 
     */
    addnewVisitor(visitor: Visitor) {
        this._visitors.push(visitor)
        this._cells.queue.push(visitor)
        visitor.place(this)
    }

}