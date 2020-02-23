// @flow
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import mainSaga from "./sagas";
import reducer from "./reducers";
import { devToolsEnhancer } from "redux-devtools-extension";

const sagaMiddleware = createSagaMiddleware();

const configureStore = preloadedState => {
  const middlewares = [sagaMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer, devToolsEnhancer()];
  const composedEnhancers = compose(...enhancers);
  const store = createStore(reducer, preloadedState, composedEnhancers);
  sagaMiddleware.run(mainSaga);
  return store;
};

export default configureStore;
