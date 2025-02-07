import { combineReducers } from "redux";
import interview from "@/reducers/interview"
import resume from "@/reducers/resume"

const rootReducer = combineReducers({
    interview,
    resume,
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
