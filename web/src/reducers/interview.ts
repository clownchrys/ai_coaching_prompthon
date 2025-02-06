import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SpeakerType = "면접관" | "지원자"

export type DirectiveOK = { text: string }
export type DirectiveRetry = { count: number }
export type DirectiveFailed = { type: "error" | "cancelled" }

export type DirectiveType = undefined
    | DirectiveOK
    | DirectiveRetry
    | DirectiveFailed

export type ChatMessage = {
    speaker: SpeakerType
    text: string
}
export type ChatHistory = ChatMessage[]

export type InterviewState = {
    initialized: boolean,
    currentSpeaker: SpeakerType,
    directive: DirectiveType,
    history: ChatHistory,
}

const name = "interview";
const initialState: InterviewState = {
    initialized: false,
    currentSpeaker: "면접관",
    directive: undefined,
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
        return { ...state, ...action.payload }
    },
  }
})
export default reducer;