import Board from "../objects/board.mjs";
import { ACTIONCARD_TYPE } from "../objects/cardAction.mjs";
import CardAnimation, { ANIMCARD_TYPE } from "../objects/cardAnimation.mjs";
import { ORGANISATIONS } from "../objects/game.mjs";
import Mission from "../objects/mission.mjs";
import Player from "../objects/player.mjs";
import { CONSOLE_COLOR } from "../types/consoleColor.mjs";

export default class PlayerBrain {

    /**
     * 
     * @param player 
     * @param nbToProgram 
     */
    static async programMissions(player: Player, nbToProgram: number = 4, method: 'random' = 'random') {
        
        if (method === 'random') {
            
            for (let i = 0; i < nbToProgram; i++) {
                const action = this.pickRandom(player.actionHand)
                const orga = this.pickRandom(player.organisationHand)
    
                const visible: 'organisaton' | 'action' = Math.random() < 0.5 ? 'organisaton' : 'action'
                const mission = new Mission(action, orga, player, visible)
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

        if (method === 'random') {

            let targetPlayer: Player
            if (animationCard.type === ANIMCARD_TYPE.FriendlyNeighbor) {
                // pick next
                targetPlayer = this.getNextPlayer(player, allPlayers)
            } else {
                const otherPlayer = allPlayers.filter(p => p !== player && p.hasSecurityToken === false)
                targetPlayer = this.pickRandom(otherPlayer)
            }

            const mission = this.pickRandom(targetPlayer.mission)

            const card = player.organisationHand[0]
            if (mission.visibleCard === "organisaton" && mission.finalOrganisaiton === card.organisation ) {
                // Try again
                console.log("Try again random sabotage")
                this.sabotage(args, method)
            } else {
                player.doSabotage(mission)
            }

        }
    }

    
    /**
     * 
     * @param mission 
     * @param board 
     */
    static async execMission(args: {mission: Mission, board: Board, animationCard: CardAnimation}, method: 'random' = 'random') {
        const {mission, board, animationCard} = args

        if (method === 'random') {
            console.log(`        Mission: ${mission.action.type} / ${mission.organisation.organisation}`)
            
            let organisation: ORGANISATIONS = mission.finalOrganisaiton
            if (organisation !== mission.organisation.organisation) {
                console.log(`        ${CONSOLE_COLOR.blue}Sabotage: ${organisation}${CONSOLE_COLOR.white}`)
            }
                

            switch (mission.action.type) {
                case ACTIONCARD_TYPE.Arguments:
                break;
                case ACTIONCARD_TYPE.CounterArgument:
                break;
                case ACTIONCARD_TYPE.Goodies:
                break;
                case ACTIONCARD_TYPE.Hijacking:
                break;
                case ACTIONCARD_TYPE.Investigation:
                break;
                case ACTIONCARD_TYPE.MakeDisappear:
                break;
                case ACTIONCARD_TYPE.Security:
                break;
                case ACTIONCARD_TYPE.TargetedArguments:
                break;
            }

        }
    }


    /**
     * 
     * @param array 
     * @param removeFromArray 
     * @returns 
     */
    private static pickRandom<T>(array: T[], removeFromArray: boolean = false): T {
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