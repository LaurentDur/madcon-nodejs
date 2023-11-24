
export const NB_STEPS = 4
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
