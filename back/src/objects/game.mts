import PlayerBrain from "../controller/playerBrain.mjs";
import Stats from "../controller/stats.mjs";
import { CONSOLE_COLOR, CONSOLE_TEXT } from "../types/consoleColor.mjs";
import Board from "./board.mjs";
import CardAction, { ACTIONCARDS } from "./cardAction.mjs";
import CardAnimation, { ANIMCARD_TYPE } from "./cardAnimation.mjs";
import CardOrganisation from "./cardOrganisation.mjs";
import Entity from "./entity.mjs";
import Player from "./player.mjs";
import Team from "./team.mjs";
import Visitor from "./visitor.mjs";
import { z } from "zod"

export const NB_TURN = 5
export const MISSION_LIMIT = 5
export const HAND_SIZE_ACTION = MISSION_LIMIT + 1
export const HAND_SIZE_ORGA = MISSION_LIMIT + 1



export enum ORGANISATIONS {
    orga1= "Don Leon",
    orga2= "Los Muertos",
    orga3= "торговец",
    orga4= "ハッカー",
}

export const VISITORS_DISPATCH = [
    { value: 2, count: 12, name: "Bad Ass"},
    { value: -1, count: 8, name: "FBI"},
    { value: -2, count: 5, name: "Bond"},
    { value: 0, count: 5, name: "Looser"},
    { value: 1, count: 20, name: "Vilain"},
]

export enum PLAYER_NAMES {
    "John",
    "Annie",
    "Larry",
    "Jenny",
    "William",
    "Greg",
    "Mary",
}


export default class Game extends Entity {

    readonly board:Board = new Board()
    readonly nbPlayer: number
    readonly players: Player[] = []
    readonly animationDeck: CardAnimation[] = []

    readonly teams: Team[] = []

    private _stats: Stats
    private _currentRound = 0
    private _currentAnimation?: CardAnimation

    /**
     * 
     * @param nbPlayer 
     */
    constructor(nbPlayer: number) {
        super()
        this.nbPlayer = z.number().min(2).max(7).parse(nbPlayer)
        this._stats = new Stats()
        // Init game
        this.reset()
    }

    /**
     * 
     */
    reset(): void {
        // Reset components
        this.board.reset()
        this._stats = new Stats()
        this.animationDeck.length = 0

        // Init component
        this.createAnimationDeck()
        this.createTeams()
        this.createVisitors()
        this.createPlayers()

        this._currentRound = 0
    }

    /**
     * 
     */
    get stats() {
        return this._stats
    }

    /**
     * 
     */
    protected createTeams() {

        const orgas = [ORGANISATIONS.orga1, ORGANISATIONS.orga2, ORGANISATIONS.orga3, ORGANISATIONS.orga4]
        this.shuffleArray(orgas)

        // Clean
        this.teams.forEach(p => p.reset())
        this.teams.length = 0

        // Create
        this.teams.push( new Team('Wolf', orgas[0], orgas[1], Math.floor(this.nbPlayer / 2)))
        this.teams.push( new Team('Squid', orgas[2], orgas[3], Math.floor(this.nbPlayer / 2)))

        if (this.nbPlayer % 2 === 1) this.teams.push( new Team('FBI', null, null, 1, 'fbi'))
    }

    /**
     * 
     */
    protected createAnimationDeck() {
        const cards = Object.values(ANIMCARD_TYPE).map(anim => new CardAnimation(anim as ANIMCARD_TYPE))
        this.animationDeck.push(...cards)
    }

    /**
     * 
     */
    protected createPlayerCardDeck() {

        this.players.forEach(player => {

            // Organisation cards
            const cards = [
                ...Object.values(ORGANISATIONS).map(orga => new CardOrganisation(orga as ORGANISATIONS)),
                ...Object.values(ORGANISATIONS).map(orga => new CardOrganisation(orga as ORGANISATIONS)),
            ]
            this.shuffleArray(cards)
            player.giveOrganisationCards(cards)



            // Action cards
            const actCards: CardAction[] = []
            ACTIONCARDS.forEach(desc => {
                for (let i = 0; i < desc.nb; i++) {
                    actCards.push( new CardAction(desc.type) )
                }
            })
            this.shuffleArray(actCards)
            player.giveActionCards(actCards)
        })

        
    }

    /**
     * 
     */
    protected createPlayers() {
        // Clean
        this.players.forEach(p => p.reset())
        this.players.length = 0

        // Create
        const names = Object.values(PLAYER_NAMES) as string[]

        for (let i = 0; i < this.nbPlayer && i < names.length; i++ ) {
            const player = new Player(names[i])
            this.players.push(player)
        }
    }

    /**
     * 
     */
    protected dispatchPlayerInTeams() {
        const vector: Team[] = []
        this.teams.forEach(team => {
            for (let i = 0; i < team.limit; i++) {
                vector.push(team)
            }
        })

        this.shuffleArray(vector)

        for (let i = 0; i < this.players.length; i++) {
            const team = vector[i]
            team.assign( this.players[i] )
        }
    }

    /**
     * 
     */
    protected createVisitors() {
        VISITORS_DISPATCH.forEach(n => {
            for (let i = 0; i < n.count; i++ ) {
                const visitor = new Visitor(n.name, n.value)
                this.board.addnewVisitor(visitor)
            }
        })
    }

    /**
     * 
     * @returns 
     */
    verbose(): string[] {
        const log: string[] = []

        log.push(`Party ID: ${this.uuid}`)
        log.push(`They are in round ${this._currentRound}`)
        log.push(`${this.animationDeck.length} cards in aniamtion deck`)
        log.push(`Current animation ${CONSOLE_COLOR.yellow}${this._currentAnimation?.type}${CONSOLE_COLOR.white}`)
        log.push(`${this.players.length} players in game ( ${this.players.map(n => n.name).join(', ')} )`)
        
        log.push(`Players:`)
        this.players.forEach(p => log.push( ...(p.verbose().map(n => '   '+n))))
        
        log.push(`Board:`)
        log.push( ...(this.board.verbose().map(n => '   '+n)))

        return log
    }

    /**
     * 
     * @param title 
     */
    console(title: string) {
        console.log(`${CONSOLE_COLOR.red}>>------------------------------------`)
        console.log('>>---      ' + title)
        console.log(`>>------------------------------------${CONSOLE_COLOR.white}`)
        this.verbose().forEach(n => console.log(n))
        console.log(`${CONSOLE_COLOR.red}-<<------------------------------------${CONSOLE_COLOR.white}`)
        console.log(' ')
    }

    /**
     * 
     */
    async startGame() {

        console.log(`${CONSOLE_COLOR.red}${CONSOLE_TEXT.startGame}`)
    
        this.createPlayerCardDeck()
        this.dispatchPlayerInTeams()
        this.players[0].giveSecurityToken()

        this.console("Will start tour")

        for ( let i = 0; i < NB_TURN; i++) {
            await this.startTour()
        }

        console.log(`${CONSOLE_COLOR.red}${CONSOLE_TEXT.endGame}${CONSOLE_COLOR.white}`)
        return this.countScores()

    }

    protected countScores() {
        const scores: {[k:string]: {count: number, score: number, details: number[], visitors: Visitor[]}} = {}
        const list = this.board.visitors.filter(v => v.position.where === 'enrolled')

        Object.values(ORGANISATIONS).forEach(o => {
            scores[o] = {count: 0, score: 0, details: [], visitors: []}
        })

        list.forEach(visitor => {
            const key = visitor.position.orga || 'ns'
            scores[key].count++
            scores[key].score += visitor.value
            scores[key].details.push(visitor.value)
            scores[key].visitors.push(visitor)
        })

        const teams: {team: string, players: string[], score: number }[] = []
        this.teams.forEach(team => {

            if (team.type === "recruiter") {
                const teamScore = scores[team.orgaA || ''].score + scores[team.orgaB || ''].score
                const obj = {team: team.name, players: team.players.map(p => p.name), score: teamScore }
                teams.push( obj )
            } else if (team.type === 'fbi') {
                let teamScore = 0
                list.filter(v => v.value < 0).forEach(v => {
                    teamScore += v.value
                })
                teams.push( {team: team.name, players: team.players.map(p => p.name), score: -1 * teamScore } )
            }
        })

        return {scores, teams}
    }

    /**
     * 
     */
    protected async startTour() {
        this._currentRound++
        console.log(`${CONSOLE_COLOR.red}${CONSOLE_TEXT.newTour}`)
        console.log(`Starting Round ${this._currentRound} of game ${this.uuid}${CONSOLE_COLOR.white}`)
        
        // Pick new anim card
        this.pickAnimCard()
        
        // Make them draw
        this.players.forEach(player => player.drawHand() )
        this.console("After Draw") 



        // Programmation
        await this.programmationPhase()
        this.console("After Programmation")

        // Sabotage
        await this.sabotagePhase()
        this.console("After Sabotage")

        // run actions
        await this.actionPhase()


        // Empty hands
        this.players.forEach(player => player.emptyHand() )
        // Empty mission
        this.players.forEach(player => player.emptyMission() )
        this.console("After Tour")




    }

    protected async pickAnimCard() {
        this._currentAnimation = this.pickRandom(this.animationDeck, true)
    }
    protected async programmationPhase() {
        await Promise.all(
            this.players.map(player => PlayerBrain.programMissions(player))
        )
    }
    protected async sabotagePhase() {
        await Promise.all(
            this.players.map(player => PlayerBrain.sabotage({player, allPlayers: this.players, animationCard: this._currentAnimation as CardAnimation}))
        )
    }
    protected async actionPhase() {

        let player = this.players.find(n => n.hasSecurityToken)
        if (!player) throw new Error('No player has the Security token')

        let stop = false
        while (!stop) {
            const missions = player.mission.filter(n => !n.executed)
            if (missions.length > 0) {
                console.log(`    Current player ${CONSOLE_COLOR.yellow}${player.name}${CONSOLE_COLOR.white}`)
                const playerMission = missions[0]
                await PlayerBrain.execMission({
                    player, 
                    players: this.players,
                    mission: playerMission,
                    board: this.board,
                    animationCard: this._currentAnimation as CardAnimation,
                    stats: this._stats
                })
                this._stats.push('action', playerMission.action.type)
                this._stats.push('organisation', playerMission.finalOrganisaiton)
    
                // Set this mission as executed
                playerMission.setExecuted()
    
                // get next player 
                player = PlayerBrain.getNextPlayer(player, this.players)
            } else {
                // All missions have been executed
                stop = true;
            }
        }
        
        console.log(" ")
        console.log("    All Actions are done !")
        
    }

}