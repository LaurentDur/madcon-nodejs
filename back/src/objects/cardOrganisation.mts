import Card from "./card.mjs";
import { ORGANISATIONS } from "./game.mjs";

export default class CardOrganisation extends Card {

    readonly organisation: ORGANISATIONS

    constructor(organisation: ORGANISATIONS) {
        super()
        this.organisation = organisation
    }

    reset(): void {
    }

}