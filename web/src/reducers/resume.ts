import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ResumeState = {
    currentResume: string
}

const name = "resume";
const initialState: ResumeState = {
    currentResume: ""
}

export const { actions, reducer } = createSlice({
  name,
  initialState,
  reducers: {
    init(state) {
        return { ...initialState }
    },
    set(state, action: PayloadAction<Partial<ResumeState>>) {
        return { ...state, ...action.payload }
    },
  }
})
export default reducer;