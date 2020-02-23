import { combineReducers } from "redux";
import * as common from "./common";
import * as questionTypes from "../types/questions";

const byId = common.byId({
  fetched: [questionTypes.QUESTIONS_FETCH_SUCCEED],
  cleared: [questionTypes.QUESTIONS_REMOVED]
});

const order = common.order({
  fetched: [questionTypes.QUESTIONS_FETCH_SUCCEED],
  cleared: [questionTypes.QUESTIONS_REMOVED]
});

const current = common.mux({
  selected: [questionTypes.SET_CURRENT_QUESTION],
  default: -1,
  allDeselected: [questionTypes.QUESTIONS_REMOVED]
});

const isFetching = common.isFetching({
  started: [questionTypes.QUESTIONS_FETCH_STARTED],
  succeed: [questionTypes.QUESTIONS_FETCH_SUCCEED],
  failed: [questionTypes.QUESTIONS_FETCH_FAILED]
});

const error = common.errors({
  populate: [questionTypes.QUESTIONS_FETCH_FAILED],
  clear: [questionTypes.QUESTIONS_FETCH_SUCCEED]
});

const questions = combineReducers({
  byId,
  order,
  isFetching,
  error,
  current
});

export const isFetchingQuestions = state => state.isFetching;
export const questionsError = state => state.error;
export const currentQuestion = state => state.byId[state.current];
export const getQuestion = (state, id) => {
  return state.byId[id];
};
export const nextQuestion = state => {
  const allQuestions = state.order.map(id => state.byId[id]);
  let nextQuestion = [];
  if (state.current === -1) {
    nextQuestion = allQuestions.filter(question => question.ordinal === 0);
  } else {
    const currentOrdinal = state.byId[state.current].ordinal;
    nextQuestion = allQuestions.filter(
      question => question.ordinal === currentOrdinal + 1
    );
  }

  if (nextQuestion.length > 0) {
    return nextQuestion[0];
  }
  return undefined;
};

export default questions;
