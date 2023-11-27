import { createContext } from "react";
import { ISelectableContext } from "../types/ISelectableContext";

export const selectableList: ISelectableContext = {
    question: undefined,
    selectableVisitors: [],
    selectableCards: [],
    selectableMissions: [],
    selectableOrganisation: [],
}

export const SelectableContext = createContext(selectableList);

