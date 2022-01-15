import { Context, createContext } from "react";

const DoneGameDispatchContext: Context<Function> = createContext(() => {});

export default DoneGameDispatchContext;
