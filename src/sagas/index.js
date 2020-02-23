import { fork, all } from "redux-saga/effects";
import { watchFetchQuestions } from "./questions";
import { watchCreateAnswer } from "./answers";

function* mainSaga() {
  yield all([fork(watchFetchQuestions), fork(watchCreateAnswer)]);
}

export default mainSaga;
