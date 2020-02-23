import { takeEvery, put, select } from "redux-saga/effects";
import { arrayOfQuestions } from "../schemas/questions";
import * as selectors from "../reducers";
import * as questionsActions from "../actions/questions";
import { normalize } from "normalizr";
import { Api, fetchAsync } from "../api/api";
import uuidv4 from "uuid/v4";
import * as questionTypes from "../types/questions";

let decodeHTML = function(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "_") // collapse whitespace and replace by -
    .replace(/-+/g, "_"); // collapse dashes

  return str;
}

export function* fetchQuestions(action) {
  // Fetch the next route
  try {
    const questionsResponse = yield fetchAsync(Api.getQuestions);

    const questionsWithIds = questionsResponse.results.map((elm, i) => {
      // If other question types exists, here might be the place to clean data.
      if (elm.type === "boolean") {
        const correct_answer = elm.correct_answer === "True" ? true : false;
        return {
          id: uuidv4(),
          ...elm,
          question: decodeHTML(elm.question),
          category: decodeHTML(elm.category),
          categorySlug: string_to_slug(decodeHTML(elm.category)),
          ordinal: i,
          correct_answer
        };
      } else {
        return {
          id: uuidv4(),
          ordinal: i,
          question: decodeHTML(elm.question),
          category: decodeHTML(elm.category),
          categorySlug: string_to_slug(decodeHTML(elm.category)),
          ...elm
        };
      }
    });

    const { entities, result } = normalize(questionsWithIds, arrayOfQuestions);
    yield put(
      questionsActions.fetchQuestionsSucceed(entities.question, result)
    );
    const nextQuestion = yield select(selectors.nextQuestion);

    yield put(questionsActions.setCurrentQuestion(nextQuestion.id, result));
  } catch (error) {
    // Set error
    const { statusCode, message, data, isPlain } = error;
    yield put(
      questionsActions.fetchQuestionsFailed({
        statusCode,
        message,
        data: isPlain ? "Server error" : data,
        retryAction: action
      })
    );
  }
}

export function* watchFetchQuestions() {
  yield takeEvery(questionTypes.QUESTIONS_FETCH_STARTED, fetchQuestions);
}
