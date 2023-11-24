import Board from "../objects/board.mjs";
import { ACTIONCARD_TYPE } from "../objects/cardAction.mjs";
import CardAnimation, { ANIMCARD_TYPE } from "../objects/cardAnimation.mjs";
import Mission from "../objects/mission.mjs";
import Player from "../objects/player.mjs";
import PlayerConsole from "../objects/playerConsole.mjs";
import Visitor from "../objects/visitor.mjs";
import { MISSION_LIMIT, ORGANISATIONS } from "../settings/gameSettings.mjs";
import { CONSOLE_COLOR } from "../types/consoleColor.mjs";
import { argument, pickMission, pickVisitor, randomSelectVisitors } from "./actions/argument.mjs";
import Stats from "./stats.mjs";

export default class PlayerBrain {

    /**
     * 
     * @param player 
     * @param nbToProgram 
     */
    static async programMissions(player: Player, nbToProgram: number =  MISSION_LIMIT, method: 'random' = 'random') {
        
        if (player.type === 'random') {
            
            for (let i = 0; i < nbToProgram; i++) {
                const action = this.pickRandom(player.actionHand)
                const orga = this.pickRandom(player.organisationHand)
    
                const visible: 'organisaton' | 'action' = Math.random() < 0.5 ? 'organisaton' : 'action'
                const mission = new Mission(action, orga, player, visible)
                player.addMission(mission)
            }
        } else if ( PlayerConsole.isPlayerConsole(player) ) {

            for( let i = 0; i < nbToProgram; i++) {
                const actions = player.actionHand.map( (n,i) => `${i}:${n.type}`)
                const orgas = player.organisationHand.map( (n,i) => `${i}:${n.organisation}`)
                const actionNdx = await player.ask("Select an action", ['Actions:', actions.join(' ,  '), 'Orga:', orgas.join(' ,  ')].join('\n'))
                const action = player.actionHand[parseInt(actionNdx || '0')]
                const orgaNdx = await player.ask(`Select an organisation for action ${action.type}`)
                const orga = player.organisationHand[parseInt(orgaNdx || '0')]

                
                const visible = await player.ask(`Which one is visible?`, `1:${action.type}   2:${orga.organisation}`)
    
                const mission = new Mission(action, orga, player, visible === '1' ? 'action' : 'organisaton')
                player.addMission(mission)
            }
        }

    }


    /**
     * 
     * @param player 
     * @param allPlayers 
     */
    static async sabotage(args: {player: Player, allPlayers: Player[], animationCard: CardAnimation}, method: 'random' = 'random') {
        const {player, allPlayers, animationCard} = args

            
        let mission: Mission
        if (PlayerConsole.isPlayerConsole(player)) {
            let missions = await pickMission({player, players: allPlayers.filter(p => p !== player), howMuch: 1, notDoneOnly: true})
            mission = missions[0]
        } else {
            let targetPlayer: Player
            if (animationCard.type === ANIMCARD_TYPE.FriendlyNeighbor) {
                // pick next
                targetPlayer = this.getNextPlayer(player, allPlayers)
            } else {
                const otherPlayer = allPlayers.filter(p => p !== player && p.hasSecurityToken === false)
                targetPlayer = this.pickRandom(otherPlayer)
            }
            mission = this.pickRandom(targetPlayer.mission)
        }

        const card = player.organisationHand[0]
        if (mission.visibleCard === "organisaton" && mission.finalOrganisaiton === card.organisation ) {
            // Try again
            console.log("Try again random sabotage")
            this.sabotage(args, method)
        } else {
            player.doSabotage(mission)
        }

    }

    
    /**
     * 
     * @param mission 
     * @param board 
     */
    static async execMission(args: {stats: Stats ,mission: Mission, board: Board, animationCard: CardAnimation, player: Player, players: Player[]}, method: 'random' = 'random') {
        const {mission, board, animationCard, player, players, stats} = args

        console.log(`        Mission: ${mission.action.type} / ${mission.organisation.organisation}`)
        
        let organisation: ORGANISATIONS = mission.finalOrganisaiton
        if (organisation !== mission.organisation.organisation) {
            console.log(`        ${CONSOLE_COLOR.blue}Sabotage: ${organisation}${CONSOLE_COLOR.white}`)
        }
            
        
        switch (mission.action.type) {
            case ACTIONCARD_TYPE.Arguments:
                var howMuch = 2
                var visitors: Visitor[]
                if (PlayerConsole.isPlayerConsole(player)) {
                    visitors = await pickVisitor({board, player, entrance: true, organisation, queue: true, howMuch})
                } else {
                    visitors = await randomSelectVisitors({animationCard, board, organisation, howMuch})
                }
                visitors.forEach(visitor => argument({organisation, board, way: 'up', animationCard, visitor, player}) )
                stats.push('move','up',visitors.length)
            break;

            case ACTIONCARD_TYPE.TargetedArguments:
                var visitorsDown: Visitor[]
                var visitorsUp: Visitor[]
                if (PlayerConsole.isPlayerConsole(player)) {
                    visitorsDown = await pickVisitor({board, player, entrance: false, organisation, queue: false, howMuch: 1})
                    visitorsUp = await pickVisitor({board, player, entrance: true, organisation, queue: true, howMuch: 1})
                } else {
                    visitorsDown = await randomSelectVisitors({animationCard, board, organisation, howMuch: 1, orgaOnly: true})
                    visitorsUp = await randomSelectVisitors({animationCard, board, organisation, howMuch: 1})
                }
                visitorsDown.forEach(visitor => argument({organisation, board, way: 'down', animationCard, visitor, player}) )
                visitorsUp.forEach(visitor => argument({organisation, board, way: 'up', animationCard, visitor, player}) )
                stats.push('move','down',visitorsDown.length)
                stats.push('move','up',visitorsUp.length)
            break;

            case ACTIONCARD_TYPE.Goodies:
                var visitors: Visitor[]
                if (PlayerConsole.isPlayerConsole(player)) {
                    visitors = await pickVisitor({board, player, entrance: true, organisation, queue: true, howMuch: 2})
                } else {
                    visitors = await randomSelectVisitors({animationCard, board, organisation, howMuch: 2})
                }
                visitors.forEach(visitor => argument({organisation, board, way: 'up', animationCard, visitor, player}) )
                
                if (animationCard.type !== ANIMCARD_TYPE.Crowd) {
                    visitors.forEach(visitor => argument({organisation, board, way: 'up', animationCard, visitor, player}) )
                    stats.push('move','upx2', visitors.length)
                } else {
                    stats.push('move','up', visitors.length)
                }
            break;

            case ACTIONCARD_TYPE.Hijacking: // Move left or right
                var way: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right'
                var visitors: Visitor[]
                if (PlayerConsole.isPlayerConsole(player)) {
                    visitors = await pickVisitor({board, player, entrance: false, organisation, queue: false, howMuch: 1})
                } else {
                    visitors = await randomSelectVisitors({animationCard, board, organisation, howMuch: 1, orgaOnly: true})
                }
                visitors.forEach(visitor => argument({organisation, board, way, animationCard, visitor, player}) )
                stats.push('move',way,visitors.length)
            break;

            case ACTIONCARD_TYPE.CounterArgument:
                var visitors: Visitor[]
                if (PlayerConsole.isPlayerConsole(player)) {
                    visitors = await pickVisitor({board, player, entrance: false, organisation, queue: false, howMuch: 2})
                } else {
                    visitors = await randomSelectVisitors({animationCard, board, organisation, howMuch: 2, orgaOnly: true})
                }
                visitors.forEach(visitor => argument({organisation, board, way: 'down', animationCard, visitor, player}) )
                stats.push('move','down',visitors.length)
            break;

            case ACTIONCARD_TYPE.Investigation:
                var visitors: Visitor[]
                if (PlayerConsole.isPlayerConsole(player)) {
                    visitors = await pickVisitor({board, player, entrance: true, organisation, queue: false, howMuch: 1})
                } else {
                    visitors = await randomSelectVisitors({animationCard, board, organisation, howMuch: 1, excludeQueue: true})
                }
                visitors.forEach(v => v.seenBy(player))
            break;

            case ACTIONCARD_TYPE.MakeDisappear:
                var visitors: Visitor[]
                if (PlayerConsole.isPlayerConsole(player)) {
                    visitors = await pickVisitor({board, player, entrance: true, organisation, queue: false, howMuch: 1})
                } else {
                    visitors = await randomSelectVisitors({animationCard, board, organisation, howMuch: 1, excludeQueue: true})
                }
                visitors.forEach(visitor => board.removeVisitor(visitor))
            break;

            case ACTIONCARD_TYPE.Security:
                const currentSec = players.find(n => n.hasSecurityToken)
                currentSec?.takeSecurityToken()
                player.giveSecurityToken()
            break;

        }
    }


    /**
     * 
     * @param array 
     * @param removeFromArray 
     * @returns 
     */
    static pickRandom<T>(array: T[], removeFromArray: boolean = false): T {
        if (array.length === 0 ) throw new Error('Cannot pick, empty array')

        const index = Math.floor( Math.random() * array.length )

        if (removeFromArray) {
            const o = array.splice(index, 1)
            return o[0]
        } else {
            return array[index]
        }
    }

    
    static getNextPlayer(currentPlayer: Player, playerList: Player[]): Player {
        const cpndx = playerList.findIndex(n => n === currentPlayer)
        if (cpndx === playerList.length - 1) return playerList[0]
        else return playerList[cpndx + 1]
    }
}