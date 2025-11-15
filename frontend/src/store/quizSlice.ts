import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuizState {
  quizData: any | null; // your quiz JSON (a)
}

const initialState: QuizState = {
  quizData: null,
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuizData(state, action: PayloadAction<any>) {
      state.quizData = action.payload;
    },
    clearQuiz(state) {
      state.quizData = null;
    },
  },
});

export const { setQuizData, clearQuiz } = quizSlice.actions;
export default quizSlice.reducer;
