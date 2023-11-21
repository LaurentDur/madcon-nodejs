import CardAction from "./cardAction.mjs";
import CardOrganisation from "./cardOrganisation.mjs";
import Entity from "./entity.mjs";
import Team from "./team.mjs";

const HAND_SIZE_ACTION = 5
const HAND_SIZE_ORGA = 5

export default class Player extends Entity {

    readonly name: string
    private _team?: Team
    private _hasSecurityToken: boolean = false

    private _deck_organisation: CardOrganisation[] = []
    private _deck_action: CardAction[] = []

    private _hand: {action: CardAction[], orga: CardOrganisation[]} = {action: [], orga: []}
    private _discardPile: {action: CardAction[], orga: CardOrganisation[]} = {action: [], orga: []}

    constructor(name: string) {
        super()
        this.name = name
    }

    get hasSecurityToken() {
        return this._hasSecurityToken
    }

    get team() {
        return this._team
    }

    setTeam(team?: Team) {
        this._team = team
    }

    giveOrganisationCards(cards: CardOrganisation[]) {
        this._deck_organisation.push(...cards)
    }

    giveActionCards(cards: CardAction[]) {
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
    }

    reshuffleTheActionDeck() {
        this._deck_action.push(...this._discardPile.action)
        this.shuffleArray(this._deck_action)
    }

    reshuffleTheOrgaDeck() {
        this._deck_organisation.push(...this._discardPile.orga)
        this.shuffleArray(this._deck_organisation)
    }

    reset(): void {
        this._deck_organisation.length = 0
        this._deck_action.length = 0
        this._hasSecurityToken = false
        this._hand.action.length = 0
        this._hand.orga.length = 0
        this._discardPile.action.length = 0
        this._discardPile.orga.length = 0
    }


}