import {createContext} from "react";
import {createUserState} from "../../statemanager/userState";
import {createBusinessState} from "../../statemanager/businessState";

export const storesContext = createContext({
    userState: createUserState()
});

export const businessContext = createContext({
    businessListState: createBusinessState()
});
