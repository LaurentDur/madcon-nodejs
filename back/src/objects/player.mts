import { HAND_SIZE_ACTION, HAND_SIZE_ORGA, MISSION_LIMIT } from "../settings/gameSettings.mjs";
import { CONSOLE_COLOR } from "../types/consoleColor.mjs";
import CardAction from "./cardAction.mjs";
import CardOrganisation from "./cardOrganisation.mjs";
import Entity from "./entity.mjs";
import Mission from "./mission.mjs";
import Team from "./team.mjs";

type IType = 'random' | 'console'

export default class Player extends Entity {

    protected _name: string
    private _team?: Team
    private _hasSecurityToken: boolean = false
    readonly type:IType 

    private _deck_organisation: CardOrganisation[] = []
    private _deck_action: CardAction[] = []

    private _hand: {action: CardAction[], orga: CardOrganisation[]} = {action: [], orga: []}
    private _discardPile: {action: CardAction[], orga: CardOrganisation[]} = {action: [], orga: []}

    private _missions: Mission[] = []

    constructor(name: string, type:IType = 'random' ) {
        super()
        this.type = type
        this._name = name
    }

    get hasSecurityToken() {
        return this._hasSecurityToken
    }

    get name() {
        return this._name
    }

    get team() {
        return this._team
    }

    get actionHand() {
        return this._hand.action
    }

    get organisationHand() {
        return this._hand.orga
    }

    get mission() {
        return this._missions
    }

    setTeam(team?: Team) {
        this._team = team
    }

    verbose(): string[] {
        const log: string[] = []

        log.push(` ${CONSOLE_COLOR.yellow}${this.name}${CONSOLE_COLOR.white} ${this._hasSecurityToken ? " ( Has security Token )" : ""}`)
        log.push(`- has ${CONSOLE_COLOR.yellow}${this._hand.action.length}${CONSOLE_COLOR.white} action card in hand, and ${CONSOLE_COLOR.yellow}${this._hand.orga.length}${CONSOLE_COLOR.white} orga card in hand`)
        log.push(`- has ${CONSOLE_COLOR.yellow}${this._discardPile.action.length}${CONSOLE_COLOR.white} action card in discard, and ${CONSOLE_COLOR.yellow}${this._discardPile.orga.length}${CONSOLE_COLOR.white} orga card in discard`)
        log.push(`- has ${CONSOLE_COLOR.yellow}${this._deck_action.length}${CONSOLE_COLOR.white} action card in deck, and ${CONSOLE_COLOR.yellow}${this._deck_organisation.length}${CONSOLE_COLOR.white} orga card in deck`)
        log.push(`- ${this._missions.length} programmed`)

        this._missions.forEach(p => log.push( ...(p.verbose().map(n => '    '+n))))
   
        return log
    }

    addMission(mission: Mission) {
        if (this._missions.length >= MISSION_LIMIT) throw new Error('Mission limit reached')

        // remove card from hand
        const ndxA = this._hand.action.findIndex(n => n === mission.action)
        this._hand.action.splice(ndxA, 1)
        const ndxO = this._hand.orga.findIndex(n => n === mission.organisation)
        this._hand.orga.splice(ndxO, 1)

        // then add mission
        this._missions.push(mission)
    }

    giveOrganisationCards(cards: CardOrganisation[]) {
        cards.forEach( n => n.take(this))
        this._deck_organisation.push(...cards)
    }

    giveActionCards(cards: CardAction[]) {
        cards.forEach( n => n.take(this))
        this._deck_action.push(...cards)
    }

    giveSecurityToken() {
        this._hasSecurityToken = true
    }

    takeSecurityToken() {
        this._hasSecurityToken = false
    }

    emptyHand() {
        this._discardPile.action.push(...this._hand.action)
        this._hand.action.length = 0
        this._discardPile.orga.push(...this._hand.orga)
        this._hand.orga.length = 0
    }

    emptyMission() {
        this._missions.forEach( mission => {
            this._discardPile.action.push(mission.action)
            this._discardPile.orga.push(mission.organisation)

            mission.giveBackSabotageCards()
            mission.reset()
        })
        this.mission.length = 0
    }

    giveBackSabotageCard(card: CardOrganisation) {
        this._discardPile.orga.push(card)
    }  

    drawHand() {
        this.emptyHand()
        // Action
        for (let i = 0; i < HAND_SIZE_ACTION; i++) {
            if (this._deck_action.length <= 0) {
                this.reshuffleTheActionDeck()
            }
            const card = this._deck_action.shift()
            if (card) this._hand.action.push(card)
        }

        // Orga
        for (let i = 0; i < HAND_SIZE_ORGA; i++) {
            if (this._deck_organisation.length <= 0) {
                this.reshuffleTheOrgaDeck()
            }
            const card = this._deck_organisation.shift()
            if (card) this._hand.orga.push(card)
        }

        // console.log(`${CONSOLE_COLOR.blue}`)
        // console.log(`${this.name}`)
        // console.log(`${this._hand.orga.map(n => n.uuid.substring(0,5)).join(', ')}`)
        // console.log(`${this._hand.orga.map(n => n.organisation).join(', ')}`)

        // console.log(`${this._hand.action.map(n => n.uuid.substring(0,5)).join(', ')}`)
        // console.log(`${this._hand.action.map(n => n.type).join(', ')}`)
        // console.log(`${CONSOLE_COLOR.white}`)
    }

    reshuffleTheActionDeck() {
        this._deck_action.push(...this._discardPile.action)
        this._discardPile.action.length = 0
        this.shuffleArray(this._deck_action)
    }

    reshuffleTheOrgaDeck() {
        this._deck_organisation.push(...this._discardPile.orga)
        this._discardPile.orga.length = 0
        this.shuffleArray(this._deck_organisation)
    }

    doSabotage(mission: Mission) {
        const card = this._hand.orga.splice(0, 1)
        mission.doSabotage(this, card[0])
    }

    reset(): void {
        this._deck_organisation.length = 0
        this._deck_action.length = 0
        this._hasSecurityToken = false
        this._hand.action.length = 0
        this._hand.orga.length = 0
        this._discardPile.action.length = 0
        this._discardPile.orga.length = 0

        this._missions.forEach(n => n.reset())
        this._missions.length = 0
    }



}