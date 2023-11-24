import { createContext } from "react";
import { IGameContext } from "../types/IGameContext";

export const gameData: IGameContext = {
    uuid: 'xxxx',
    visibleVisitors: ['x1','x2'],
    selectableVisitors: ['x2']
}

export const GameContext = createContext<IGameContext>(gameData);