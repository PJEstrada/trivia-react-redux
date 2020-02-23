import { combineReducers } from "redux";
import questions, * as fromQuestions from "./questions";
import answers, * as fromAnswers from "./answers";

export const genSelector = (selector, stateKey) => (state, ...args) =>
  selector(state[stateKey], ...args);

const root = combineReducers({
  questions,
  answers
});

export const isFetchingQuestions = genSelector(
  fromQuestions.isFetchingQuestions,
  "questions"
);
export const currentQuestion = genSelector(
  fromQuestions.currentQuestion,
  "questions"
);

export const getQuestion = genSelector(fromQuestions.getQuestion, "questions");

export const questionsError = genSelector(
  fromQuestions.questionsError,
  "questions"
);
export const nextQuestion = genSelector(
  fromQuestions.nextQuestion,
  "questions"
);

export const getAnswer = genSelector(fromAnswers.getAnswer, "answers");
export const getAnswers = genSelector(fromAnswers.getAnswers, "answers");

export default root;
