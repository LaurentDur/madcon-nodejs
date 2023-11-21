import Board from "./board.mjs";
import CardAction, { ACTIONCARDS } from "./cardAction.mjs";
import CardOrganisation from "./cardOrganisation.mjs";
import Entity from "./entity.mjs";
import Player from "./player.mjs";
import Team from "./team.mjs";
import Visitor from "./visitor.mjs";
import { z } from "zod"

export enum ORGANISATIONS {
    orga1= "Don Leon",
    orga2= "Los Muertos",
    orga3= "торговец",
    orga4= "ハッカー",
}

export const VISITORS_DISPATCH = [
    { value: 2, count: 10, name: "Bad Ass"},
    { value: -1, count: 15, name: "FBI"},
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

    readonly teams: Team[] = []

    private _currentRound = 0

    constructor(nbPlayer: number) {
        super()
        this.nbPlayer = z.number().min(2).max(7).parse(nbPlayer)
        
        // Init game
        this.reset()
    }

    reset(): void {
        // Reset components
        this.board.reset()

        // Init component
        this.createTeams()
        this.createVisitors()
        this.createPlayers()

        this._currentRound = 0
    }

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

    protected createVisitors() {
        VISITORS_DISPATCH.forEach(n => {
            for (let i = 0; i < n.count; i++ ) {
                const visitor = new Visitor(n.name, n.value)
                this.board.addnewVisitor(visitor)
            }
        })
    }


    startGame() {
    
        this.createPlayerCardDeck()
        this.dispatchPlayerInTeams()
        this.players[0].giveSecurityToken()

        this.startTour()

    }

    protected async startTour() {
        this._currentRound++
        console.log(`Starting Round ${this._currentRound} of game ${this.uuid}`)

        // Make them draw
        this.players.forEach(player => player.drawHand() )

        console.log( this.players[0] )

        // Programmation
        await this.programmationPhase()
        // Sabotage
        await this.sabotagePhase()
        // run actions
        await this.actionPhase()


        // Empty hands
        this.players.forEach(player => player.emptyHand() )

    }

    protected async programmationPhase() {
        // TODO

    }
    protected async sabotagePhase() {
        // TODO
        
    }
    protected async actionPhase() {
        // TODO

    }

}