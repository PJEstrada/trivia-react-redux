import { combineReducers } from "redux";
import * as common from "./common";
import * as answerTypes from "../types/answers";

const byId = common.byId({
  added: [answerTypes.ANSWER_CREATE_SUCCEED],
  idKey: "question",
  cleared: [answerTypes.ANSWERS_REMOVED]
});

const order = common.order({
  added: [answerTypes.ANSWER_CREATE_SUCCEED],
  idKey: "question",
  cleared: [answerTypes.ANSWERS_REMOVED]
});

const error = common.errors({
  populate: [answerTypes.ANSWER_CREATE_FAILED],
  clear: [answerTypes.ANSWER_CREATE_SUCCEED],
  allDeselected: [answerTypes.ANSWERS_REMOVED]
});

const answers = combineReducers({ byId, order, error });

export const getAnswer = (state, questionId) => state.byId[questionId];
export const getAnswers = state => state.order.map(id => state.byId[id]);

export default answers;
