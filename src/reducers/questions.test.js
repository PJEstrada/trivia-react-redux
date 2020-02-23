import reducer from "./questions";
import * as questionTypes from "../types/questions";

/**
 * Ideally all reducers should be tested. This is an example of how I test them using the
 * questions reducer.
 */

describe("questions reducers", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      byId: {},
      order: [],
      isFetching: false,
      error: {},
      current: -1
    });
  });
  it("should handle QUESTIONS_FETCH_STARTED", () => {
    expect(
      reducer(
        {},
        {
          type: questionTypes.QUESTIONS_FETCH_STARTED
        }
      )
    ).toEqual({
      byId: {},
      order: [],
      isFetching: true,
      error: {},
      current: -1
    });
  });
  it("should handle QUESTIONS_FETCH_SUCCEED", () => {
    expect(
      reducer(
        {},
        {
          type: questionTypes.QUESTIONS_FETCH_SUCCEED,
          payload: {
            entities: {
              1: {
                id: 1,
                category: "Science & Nature",
                type: "boolean",
                difficulty: "hard",
                question:
                  "You can calculate Induced Voltage using: ε =-N * (dΦB)/(d)",
                correct_answer: false,
                incorrect_answers: ["True"],
                categorySlug: "science_nature",
                ordinal: 0
              }
            },
            order: [1]
          }
        }
      )
    ).toEqual({
      byId: {
        1: {
          id: 1,
          category: "Science & Nature",
          type: "boolean",
          difficulty: "hard",
          question:
            "You can calculate Induced Voltage using: ε =-N * (dΦB)/(d)",
          correct_answer: false,
          incorrect_answers: ["True"],
          isConfirmed: true,
          categorySlug: "science_nature",
          ordinal: 0
        }
      },
      order: [1],
      isFetching: false,
      error: {},
      current: -1
    });
  });

  it("should handle SET_CURRENT_QUESTION", () => {
    expect(
      reducer(
        {},
        {
          type: questionTypes.SET_CURRENT_QUESTION,
          payload: 1
        }
      )
    ).toEqual({
      byId: {},
      order: [],
      isFetching: false,
      error: {},
      current: 1
    });
  });

  it("should handle QUESTIONS_FETCH_FAILED", () => {
    expect(
      reducer(
        {},
        {
          type: questionTypes.QUESTIONS_FETCH_FAILED,
          payload: { name: "this is an error test.", object_id: 1 }
        }
      )
    ).toEqual({
      byId: {},
      order: [],
      isFetching: false,
      error: {
        1: {
          name: "this is an error test.",
          object_id: 1
        }
      },
      current: -1
    });
  });

  it("should handle QUESTIONS_REMOVED", () => {
    expect(
      reducer(
        {
          byId: {
            1: {
              id: 1,
              question: "test"
            }
          },
          order: [1],
          error: {},
          current: 1,
          isFetching: false
        },
        {
          type: questionTypes.QUESTIONS_REMOVED
        }
      )
    ).toEqual({
      byId: {},
      order: [],
      isFetching: false,
      error: {},
      current: -1
    });
  });
});
