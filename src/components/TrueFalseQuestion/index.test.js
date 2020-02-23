import React from "react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import TrueFalseQuestion from "./index.jsx";
import * as answersActions from "../../actions/answers";

/**
 * Ideally all components should be tested, there is one test for a connected component here
 * just to show examples of how I test components that are connected and dispatch actions.
 */
const mockStore = configureStore([]);

describe("TrueFalseQuestion Test Case", () => {
  let store;
  let component;

  beforeEach(() => {
    store = mockStore({
      questions: {
        byId: {
          1: {
            id: 1,
            question: "Question test",
            category: "math",
            type: "boolean",
            categorySlug: "math"
          }
        },
        isFetching: false,
        current: 1,
        error: {},
        order: [1]
      },
      answers: {
        byId: {},
        order: [],
        error: {}
      }
    });
    store.dispatch = jest.fn();
    component = renderer.create(
      <Provider store={store}>
        <TrueFalseQuestion
          type={"boolean"}
          id={1}
          category={"math"}
          categorySlug={"math"}
          question={"Question test"}
        />
      </Provider>
    );
  });

  it("should render the appropiate tags.", () => {
    const testInstance = component.root;
    const titleTag = testInstance.findByProps({
      className: "questionCategory"
    });
    const questionTag = testInstance.findByProps({
      className: "questionTitle"
    });
    expect(titleTag.props.children).toEqual("math");
    expect(questionTag.props.children).toEqual("Question test");
  });

  it("should create an answer on button click", () => {
    renderer.act(() => {
      component.root.findByProps({ className: "trueButton" }).props.onClick();
      component.root.findByProps({ className: "falseButton" }).props.onClick();
    });
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith(
      answersActions.startCreatingAnswer(1, true)
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      answersActions.startCreatingAnswer(1, false)
    );
  });
});
