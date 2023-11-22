import { CONSOLE_COLOR } from "../types/consoleColor.mjs";
import Entity from "./entity.mjs";
import { ORGANISATIONS } from "./game.mjs";
import Player from "./player.mjs";
import Visitor from "./visitor.mjs";


const NB_STEPS = 5

export default class Board extends Entity {

    private _cells: { queue: Visitor[],
                        entrance: Visitor[],
                        organisations: {ref: ORGANISATIONS, visitors: Visitor[][]}[] } 
                    = {queue: [], entrance: [], organisations: []}
    private _visitors: Visitor[] = []

    private _discard: Visitor[] = []

    constructor() {
        super()
    }

    get cells() {
        return this._cells
    }
    get visitors() {
        return this._visitors
    }

    get maxSteps() {
        return NB_STEPS
    }

    verbose(): string[] {
        const log: string[] = []

        log.push(` ${CONSOLE_COLOR.green}Board`)
        log.push(`- ${this._cells.queue.length} in queue, ${this._cells.entrance.length} in entrance, ${this._discard.length} in discard`)
        this._cells.organisations.forEach(o => {
            log.push(`- ${o.ref} : ${o.visitors.map(k => k.length)}`)
        })
   
        return log
    }

    reset(): void {
        // Remove visitors
        this._visitors.forEach(n => n.reset())
        this._visitors.length = 0
        this._discard.length = 0

        const organisations:{ref: ORGANISATIONS, visitors: Visitor[][]}[] 
            = Object.values(ORGANISATIONS).map( o => { 
                const visitors: Visitor[][] = []
                for (let k = 0; k < NB_STEPS; k++) visitors.push( [] )
                return {ref: o as ORGANISATIONS, visitors}
            })
        this._cells = {queue: [], entrance: [], organisations}

    }

    move(args: {visitor: Visitor, way: 'up' | 'down' | 'left' | 'right', direction?: ORGANISATIONS, player: Player }) {
        const {visitor, way, direction, player } = args

        // -------------- UP 
        if (way === 'up') {
            if (visitor.position.where === 'enrolled') {
                throw new Error('Could not move enrolled visitors')
    
            } else if (visitor.position.where === 'queue') {
                const ndx = this._cells.queue.findIndex(v => v === visitor)
                if (ndx < 0) throw new Error('Visitor not in queue')
                this._cells.queue.splice(ndx, 1)
                this._cells.entrance.push(visitor)
                visitor.invitedBy(player)
                visitor.setPosition('entrance', undefined, undefined)
    
            } else if (visitor.position.where === 'entrance') {
                const ndx = this._cells.entrance.findIndex(v => v === visitor)
                if (ndx < 0) throw new Error('Visitor not in queue')
                this._cells.entrance.splice(ndx, 1)

                const targetOrg = this._cells.organisations.find(o => o.ref === direction)
                if (!targetOrg) throw new Error('Target orga does not exist')
                targetOrg?.visitors[0].push(visitor)
                visitor.setPosition('organisation', direction, 0)

            } else if (visitor.position.where === 'organisation') {
                const targetOrg = this._cells.organisations.find(o => o.ref === direction)
                if (!targetOrg) throw new Error('Target orga does not exist')

                if (visitor.position.steps === undefined) throw new Error('Visitor steps not defined')
                const ndx = targetOrg.visitors[visitor.position.steps].findIndex(v => v === visitor)
                if (ndx < 0) throw new Error('Visitor not in queue')
                targetOrg.visitors[visitor.position.steps].splice(ndx, 1)

                const newStep = visitor.position.steps + 1
                targetOrg.visitors[newStep].push(visitor)
                visitor.setPosition(newStep === NB_STEPS - 1 ? 'enrolled' : 'organisation', direction, newStep)
            }
        }

        // -------------- DOWN 
        if (way === 'down') {
            if (visitor.position.where === 'enrolled') {
                throw new Error('Could not mot enrolled visitors')
    
            } else if (visitor.position.where === 'queue') {
                throw new Error('Could not move backward queue visitors')
    
            } else if (visitor.position.where === 'entrance') {
                throw new Error('Could not move backward entrance visitors')

            } else if (visitor.position.where === 'organisation') {
                const targetOrg = this._cells.organisations.find(o => o.ref === direction)
                if (!targetOrg) throw new Error('Target orga does not exist')
                
                if (visitor.position.steps === undefined) throw new Error('Visitor steps not defined')
                const ndx = targetOrg.visitors[visitor.position.steps].findIndex(v => v === visitor)
                if (ndx < 0) throw new Error('Visitor not in queue')
                targetOrg.visitors[visitor.position.steps].splice(ndx, 1)

                if (visitor.position.steps === 0) {
                    this._cells.entrance.push(visitor)
                    visitor.invitedBy(player)
                    visitor.setPosition('entrance', undefined, undefined)

                } else {
                    const newStep = visitor.position.steps - 1
                    targetOrg.visitors[newStep].push(visitor)
                    visitor.setPosition(newStep === NB_STEPS - 1 ? 'enrolled' : 'organisation', direction, newStep)
                }


            }
        }

        // -------------- LEFT | RIGHT
        if (way === 'left' || way === 'right') {
            if (visitor.position.where === 'organisation') {
                const targetOrgNdx = this._cells.organisations.findIndex(o => o.ref === direction)
                const targetOrg = this._cells.organisations[targetOrgNdx]
                if (targetOrgNdx < 0 || !targetOrg) throw new Error('Target orga does not exist')

                if (visitor.position.steps === undefined) throw new Error('Visitor steps not defined')

                let nextOrga
                if (way === 'left') {
                    nextOrga = (targetOrgNdx + 1 >= this._cells.organisations.length) ? this._cells.organisations[0] : this._cells.organisations[targetOrgNdx + 1]
                } else {
                    nextOrga = (targetOrgNdx - 1 >= 0) ? this._cells.organisations[targetOrgNdx - 1] : this._cells.organisations[this._cells.organisations.length - 1]
                }

                const ndx = targetOrg.visitors[visitor.position.steps || 0].findIndex(v => v === visitor)
                if (ndx < 0) throw new Error('Visitor not in queue')
                targetOrg.visitors[visitor.position.steps].splice(ndx, 1)

                nextOrga.visitors[visitor.position.steps].push(visitor)
                visitor.setPosition('organisation', nextOrga.ref, visitor.position.steps)
            }
        }



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

    removeVisitor(visitor: Visitor) {

        if (visitor.position.where === 'entrance') {
            var cndx = this._cells.entrance.findIndex(v => v === visitor)
            if (cndx >= 0) {
                this._cells.entrance.splice(cndx, 1)
            }
        } else if (visitor.position.where === 'organisation') {
            const org = this._cells.organisations.find(n => n.ref === visitor.position.orga)
            if (org) {
                var cndx = org.visitors[visitor.position.steps || 0].findIndex(v => v === visitor) || -1
                if (cndx >= 0) {
                    org.visitors[visitor.position.steps || 0].splice(cndx, 1)
                }
            }
        }

        const ndx = this._visitors.findIndex(v => v === visitor)
        if (ndx >= 0) {
            this._visitors.splice(ndx, 1)
        }
        
        this._discard.push(visitor)

    }
}