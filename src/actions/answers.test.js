import * as answersActions from "../actions/answers";
/**
 * Ideally all action creators should be tested, there are only a few ones here
 * just to show examples of how I test actions.
 */
describe("Answers Actions Creators", () => {
  it("should create an action to start adding an answer", () => {
    const expectedAction = {
      type: "ANSWER_CREATE_STARTED",
      payload: {
        idQuestion: 1,
        value: true
      }
    };
    expect(answersActions.startCreatingAnswer(1, true)).toEqual(expectedAction);
  });

  it("should create an action for action creation success.", () => {
    const answerObj = {
      question: "d828ace9-7747-43c0-87d1-1e7c4db0fb42",
      value: false,
      is_correct: false,
      questionText: "This is a question"
    };
    const expectedAction = {
      type: "ANSWER_CREATE_SUCCEED",
      payload: answerObj
    };
    expect(answersActions.createAnswerSucceed(answerObj)).toEqual(
      expectedAction
    );
  });

  it("should create an action for removing an answer", () => {
    const expectedAction = {
      type: "ANSWERS_REMOVED"
    };
    expect(answersActions.removeAnswers()).toEqual(expectedAction);
  });

  it("should create an action for answer creation failure.", () => {
    const expectedAction = {
      type: "ANSWERS_REMOVED"
    };
    expect(answersActions.removeAnswers()).toEqual(expectedAction);
  });
});
