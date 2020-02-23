import * as answerTypes from "../types/answers";

export const startCreatingAnswer = (idQuestion, value) => ({
  type: answerTypes.ANSWER_CREATE_STARTED,
  payload: {
    idQuestion,
    value
  }
});

export const createAnswerSucceed = answer => ({
  type: answerTypes.ANSWER_CREATE_SUCCEED,
  payload: answer
});

export const removeAnswers = () => ({
  type: answerTypes.ANSWERS_REMOVED
});

export const createAnswerfailed = error => ({
  type: answerTypes.ANSWER_CREATE_FAILED,
  payload: error
});
