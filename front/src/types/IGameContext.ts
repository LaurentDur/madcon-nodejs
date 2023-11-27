import BackInterface from "../connector/BackInterface";
import { ACTIONCARD_TYPE } from "./ActionCardType";

export interface IGameContext {
    connector?:          BackInterface,
    sourceEvent:        string;
    currentPlayer:      string;
    uuid:               string;
    organisations:      string[];
    visibleVisitors:    string[];
    visitors:           Visitor[];
    players:            Player[];
    nbSteps:            number;
}

export interface Player {
    name:            string;
    firstPlayer:     boolean;
    actionHand:      Hand[];
    orgahand:        Hand[];
    mission:         Mission[];
    color:           string;
    uuid:            string;
    resultForPlayer: string;
}

export interface Mission {
    action:          Hand;
    orga:            Hand;
    executed:        boolean;
    uuid:            string;
    visible: "action" | "organisation";
    resultForPlayer:   string;
    sabotage:          Hand[];
}

export interface Hand {
    action?:         ACTIONCARD_TYPE;
    ower:            string;
    uuid:            string;
    resultForPlayer: string;
    organisation?:   string;
}

export interface Visitor {
    value?:          number;
    position:        Position;
    invitedBy:       {uuid: string, color: string};
    seen:            string[];
    uuid:            string;
    resultForPlayer: string;
}

export interface Position {
    where: string;
    orga?: string;
    steps?: number;
}
