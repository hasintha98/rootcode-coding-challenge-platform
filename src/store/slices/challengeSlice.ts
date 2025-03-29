import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChallengeState,
  CompletedQuestion,
  TimeSpent,
} from "../../types/interfaces";

const initialState: ChallengeState = {
  completedQuestions: [],
  timeSpent: [],
};

const challengeSlice = createSlice({
  name: "challenges",
  initialState,
  reducers: {
    addCompletedQuestion: (state, action: PayloadAction<CompletedQuestion>) => {
      const { challengeId, questionId, challengeTitle, totalQuestions } =
        action.payload;
      if (
        !state.completedQuestions.some(
          (cq) => cq.challengeId === challengeId && cq.questionId === questionId
        )
      ) {
        state.completedQuestions.push({
          challengeId,
          questionId,
          challengeTitle,
          totalQuestions,
        });
      }
    },
    setTimeSpent: (state, action: PayloadAction<TimeSpent>) => {
      const { challengeId, questionId, time } = action.payload;
      const existingIndex = state.timeSpent.findIndex(
        (ts) => ts.challengeId === challengeId && ts.questionId === questionId
      );
      if (existingIndex !== -1) {
        state.timeSpent[existingIndex].time = time;
      } else {
        state.timeSpent.push({ challengeId, questionId, time });
      }
    },
    clearChallengeData: (state) => {
      state.completedQuestions = [];
      state.timeSpent = [];
    },
  },
});

export const { addCompletedQuestion, setTimeSpent, clearChallengeData } =
  challengeSlice.actions;
export default challengeSlice.reducer;
