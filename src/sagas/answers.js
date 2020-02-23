import { takeEvery, put, select, call } from "redux-saga/effects";
import { arrayOfQuestions } from "../schemas/questions";
import * as selectors from "../reducers";
import * as answerActions from "../actions/answers";
import * as questionsActions from "../actions/questions";
import { normalize } from "normalizr";
import uuidv4 from "uuid/v4";
import history from "../history";
import * as answerTypes from "../types/answers";

function* createAnswer(action) {
  // Fetch the next route
  try {
    const { idQuestion, value } = action.payload;
    const question = yield select(selectors.getQuestion, idQuestion);
    const answerObject = {
      question: idQuestion,
      value,
      is_correct: value === question.correct_answer,
      questionText: question.question
    };

    yield put(answerActions.createAnswerSucceed(answerObject));
    const nextQuestion = yield select(selectors.nextQuestion);
    if (nextQuestion) {
      yield put(questionsActions.setCurrentQuestion(nextQuestion.id));
    } else {
      // Finish Quizz

      yield call(history.push, "/results");
    }
  } catch (error) {
    // Set error
    const { statusCode, message, data, isPlain } = error;
    yield put(
      answerActions.createAnswerfailed({
        statusCode,
        message,
        data: isPlain ? "Creation Failed" : data,
        retryAction: action
      })
    );
  }
}

export function* watchCreateAnswer() {
  yield takeEvery(answerTypes.ANSWER_CREATE_STARTED, createAnswer);
}
