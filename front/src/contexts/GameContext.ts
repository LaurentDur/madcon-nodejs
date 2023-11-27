import { createContext } from "react";
import { IGameContext } from "../types/IGameContext";

export const gameData: IGameContext = {
    nbSteps: 1,
    uuid: '',
    currentPlayer: '',
    organisations: [' ',' ',' ',' '],
    visibleVisitors: [],
    players: [],
    sourceEvent: '',
    visitors: []
}

export const GameContext = createContext<IGameContext>(gameData);

