import { createContext } from "react";
import { ISelectableContext } from "../types/ISelectableContext";

export const selectableList: ISelectableContext = {
    selectableVisitors: [],
    selectableCards: [],
    selectableMissions: [],
}

export const SelectableContext = createContext(selectableList);

