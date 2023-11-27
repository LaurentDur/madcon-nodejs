import Board from "../../objects/board.mjs"
import CardAnimation from "../../objects/cardAnimation.mjs"
import Mission from "../../objects/mission.mjs"
import Player from "../../objects/player.mjs"
import PlayerConsole from "../../objects/playerConsole.mjs"
import PlayerFront from "../../objects/playerFront.mjs"
import Visitor from "../../objects/visitor.mjs"
import { ORGANISATIONS } from "../../settings/gameSettings.mjs"
import PlayerBrain from "../playerBrain.mjs"


export async function pickMission(args: {player: PlayerConsole | PlayerFront,  players: Player[], howMuch: number, notDoneOnly: boolean}) {
    const {players, notDoneOnly, howMuch, player} = args

    const result: Mission[] = []
    for (let i = 0; i < howMuch; i++) {
        const candidates: Mission[] = []
        players.forEach(p => candidates.push(...p.mission.filter(m => !notDoneOnly || (notDoneOnly && !m.executed))))

        
        let uuid: string = ''
        if (PlayerConsole.isPlayerConsole(player)) {
            const context = candidates.map((m) => {
                const sab = m.sabotage.length > 0 ? ` : Sabotage by ${m.sabotage.map(n => n.player.name).join(', ')}` : ''
                return `${m.uuid} : ${m.visibleCard === 'action' ? m.action.type : m.organisation.organisation} : ${m.player.name}${sab}`
            })
            uuid = await player.ask(`Select a mission`, context.join('\n'))
            
        } else if (PlayerFront.isPlayerFront(player)) {
            uuid = await player.ask(`Select a mission`, {mission: candidates.map(n => n.uuid)})
        }
        result.push(...candidates.filter(v => v.uuid === uuid))
    }

    return result
}

export async function pickVisitor(args: {player: PlayerConsole | PlayerFront, queue: boolean, entrance: boolean, organisation: ORGANISATIONS, board: Board, howMuch: number} ) {
    const {organisation, board, player, queue, entrance, howMuch} = args

    const result: Visitor[] = []
    for (let i = 0; i < howMuch; i++) {

        const rawCandidates = getCandidates({board, organisation})
        const candidate: Visitor[] = [
            ...(entrance ? rawCandidates.entrance.filter(n => !result.includes(n) ) : []),
            ...rawCandidates.organisation.filter(n => !result.includes(n) )
        ]
        
        if (candidate.length > 0) {
            let uuid: string = ''
            if (PlayerConsole.isPlayerConsole(player)) {
                uuid = await player.ask("Pick a visitor (or queue)", candidate.map( v => {
                    const value = v.seen.includes(player) ? ` : ${v.value}` : ''
                    return `${v.uuid}${value} - ${v.position.where} ${v.position.steps || ''}`
                }).join('\n') )
                
            } else if (PlayerFront.isPlayerFront(player)) {
                uuid = await player.ask(`Select a visitor`, {visitor: candidate.map(n => n.uuid)})
            }
    
            if (uuid === 'queue' && candidate.length < (howMuch - i)) {
                result.push(PlayerBrain.pickRandom(rawCandidates.queue))
            } else {
                result.push(...candidate.filter(v => v.uuid === uuid))
            }
        } else {

            if (queue && rawCandidates.queue.length > 0) {
                const visitor = PlayerBrain.pickRandom(rawCandidates.queue)
                result.push(visitor)
            }
        }

    
    }

    return result
}

/**
 * take visitors randomly and run arguments action
 */
export async function randomSelectVisitors(args: {organisation: ORGANISATIONS, excludeQueue?: boolean, orgaOnly?: boolean, board: Board, howMuch: number, animationCard: CardAnimation}): Promise<Visitor[]> {
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