import Board from "../../objects/board.mjs"
import CardAnimation from "../../objects/cardAnimation.mjs"
import { ORGANISATIONS } from "../../objects/game.mjs"
import Player from "../../objects/player.mjs"
import Visitor from "../../objects/visitor.mjs"
import PlayerBrain from "../playerBrain.mjs"


/**
 * take visitors randomly and run arguments action
 */
export async function randomSelectVisitors(args: {organisation: ORGANISATIONS, excludeQueue?: boolean, orgaOnly?: boolean, board: Board, howMuch: number, animationCard: CardAnimation}) {
    const {organisation, board, animationCard, howMuch, orgaOnly, excludeQueue} = args

    const candidates = getCandidates({board, organisation})

    const toWelcome: Visitor[] = []
    if (orgaOnly !== true && excludeQueue !== true) {
        const visitorsIn = candidates.organisation.length + candidates.entrance.length
        if (visitorsIn < howMuch) {
            for(let i = 0; i < howMuch - visitorsIn; i++) {
                toWelcome.push( PlayerBrain.pickRandom(candidates.queue) )
            }
        }
    }

    
    const selected: Visitor[] = []
    for(let i = toWelcome.length; i < howMuch; i++) {
        const possible: Visitor[] = [...candidates.organisation, ...(orgaOnly ? [] : candidates.entrance)]
        const filtered = possible.filter(v => !selected.includes(v))
        if (filtered.length > 0) {
            selected.push( PlayerBrain.pickRandom(filtered) )
        }
    }
    return [...toWelcome, ...selected]

}

/**
 * run arguments action 
 */
export function argument(args: {visitor: Visitor, way: 'up' | 'down' | 'left' | 'right', player: Player, organisation: ORGANISATIONS, board: Board, animationCard: CardAnimation}) {
    const {organisation, board, animationCard, visitor, player, way} = args

    if (visitor.position.where !== 'enrolled') {
        board.move({visitor, way, direction: organisation, player })
    }
}

function getCandidates(args: {organisation: ORGANISATIONS, board: Board}) {
    const {organisation, board} = args

    const orgsteps = board.cells.organisations.find(n => n.ref === organisation)

    const candidates: {queue: Visitor[], entrance: Visitor[], organisationCell: Visitor[][], organisation: Visitor[]} = {
        queue: [...board.cells.queue],
        entrance: [...board.cells.entrance],
        organisationCell: [...(orgsteps?.visitors || [])],
        organisation: [...board.visitors.filter(v => 
                v.position.where === 'organisation' && 
                v.position.orga === organisation
                )]
    }

    return candidates;
}