import { createContext } from "react";
import { IGameContext } from "../types/IGameContext";

export const gameData: IGameContext = {
    uuid: 'xxxx',
    organisations: ['Azerty','Boutic','Clarisse','DErriere'],
    visibleVisitors: ['x1','x2'],
    selectableVisitors: ['x2'],
    selectableCards: ['a1','a3'],
    visibleCards: ['a2','a3','a6']
}

export const GameContext = createContext<IGameContext>(gameData);