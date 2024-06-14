import { useContext } from "react";
import {storesContext} from "./context/stores-context";

export const useStores = () => useContext(storesContext);
