import Board from "./board.mjs";
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

    constructor(nbPlayer: number) {
        super()
        this.nbPlayer = z.number().min(2).max(7).parse(nbPlayer)
    }

    reset(): void {
        // Reset components
        this.board.reset()

        // Init component
        this.createTeams()
        this.createVisitors()
        this.createPlayers()

        this.dispatchPlayerInTeams()
        this.players[0].giveSecurityToken()

        this.createPlayerCardDeck()
    }

    protected createTeams() {
        // Clean
        this.teams.forEach(p => p.reset())
        this.teams.length = 0

        // Create
        this.teams.push( new Team('Wolf', Math.floor(this.nbPlayer / 2)))
        this.teams.push( new Team('Squid', Math.floor(this.nbPlayer / 2)))

        if (this.nbPlayer % 2 === 1) this.teams.push( new Team('FBI', 1, 'fbi'))
    }

    protected createPlayerCardDeck() {

        // Organisation cards
        this.players.forEach(player => {
            const cards = [
                ...Object.keys(ORGANISATIONS).map(orga => new CardOrganisation(orga as ORGANISATIONS)),
                ...Object.keys(ORGANISATIONS).map(orga => new CardOrganisation(orga as ORGANISATIONS)),
            ]
            this.shuffleArray(cards)
            player.giveOrganisationCards(cards)
        })

        
        // Action cards
        // TODO
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

}