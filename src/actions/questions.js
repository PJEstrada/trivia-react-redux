import * as questionTypes from "../types/questions";

export const startFetchingQuestions = () => ({
  type: questionTypes.QUESTIONS_FETCH_STARTED
});

export const fetchQuestionsSucceed = (entities, order) => ({
  type: questionTypes.QUESTIONS_FETCH_SUCCEED,
  payload: {
    entities,
    order
  }
});

export const setCurrentQuestion = ordinal => ({
  type: questionTypes.SET_CURRENT_QUESTION,
  payload: ordinal
});

export const fetchQuestionsFailed = error => ({
  type: questionTypes.QUESTIONS_FETCH_FAILED,
  payload: error
});

export const removeQuestions = () => ({
  type: questionTypes.QUESTIONS_REMOVED
});
