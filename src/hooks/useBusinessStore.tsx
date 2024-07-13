import {useContext} from "react";
import {businessContext} from "./context/stores-context";

export const useBusinessStores = () => useContext(businessContext);
