import {createContext} from "react";
import {createUserState} from "../../statemanager/userState";

export const storesContext = createContext({
    userState: createUserState()
});
