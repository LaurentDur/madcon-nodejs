import BackInterface from "../connector/BackInterface";

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
    actionHand:      Hand[];
    orgahand:        Hand[];
    mission:         any[];
    color:           string;
    uuid:            string;
    resultForPlayer: string;
}

export interface Hand {
    action?:         string;
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
}
