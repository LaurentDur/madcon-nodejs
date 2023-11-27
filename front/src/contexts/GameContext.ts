import { createContext } from "react";
import { IGameContext } from "../types/IGameContext";

export const gameData: IGameContext = {
    uuid: '',
    currentPlayer: '',
    organisations: [' ',' ',' ',' '],
    visibleVisitors: [],
    selectableVisitors: [],
    selectableCards: [],
    visibleCards: [],
    players: [],
    sourceEvent: '',
    visitors: []
}

export const GameContext = createContext<IGameContext>(gameData);