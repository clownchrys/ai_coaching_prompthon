import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DirectiveOK = { text: string }
export type DirectiveRetry = { count: number }
export type DirectiveFailed = { type: "error" | "cancelled" }

export type DirectiveType = undefined
    | DirectiveOK
    | DirectiveRetry
    | DirectiveFailed

export type ChatMessage = {
    speaker: "interviewer" | "interviewee"
    text: string
}
export type ChatHistory = ChatMessage[]

export type InterviewState = {
    directive: DirectiveType,
    loading: boolean,
    history: ChatHistory
}

const name = "interview";
const initialState: InterviewState = {
    directive: undefined,
    loading: false,
    history: [],
}

export const { actions, reducer } = createSlice({
  name,
  initialState,
  reducers: {
    init(state) {
        return { ...initialState }
    },
    set(state, action: PayloadAction<Partial<InterviewState>>) {
        return { ...state, ...action}
    },
    get(state) {
        return state
    }
  }
})
export default reducer;