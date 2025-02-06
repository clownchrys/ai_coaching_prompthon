import { combineReducers } from "redux";
import interview from "@/reducers/interview"

const rootReducer = combineReducers({
    interview
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
