import {createState as cs} from "./state_manage"
import {Provider as p,watch as w} from "./connect"

export const createState=cs;
export const Provider=p;
export const watch=w;