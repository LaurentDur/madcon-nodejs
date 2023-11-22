import { ORGANISATIONS } from "../settings/gameSettings.mjs";
import Card from "./card.mjs";

export default class CardOrganisation extends Card {

    readonly organisation: ORGANISATIONS

    constructor(organisation: ORGANISATIONS) {
        super()
        this.organisation = organisation
    }

    reset(): void {
    }

}