import React, { Component } from "react";
import Home from "./screens/Home";
import Quiz from "./screens/Quiz";
import Results from "./screens/Results";
import "./App.css";
import configureStore from "./configureStore";
import { Provider } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route path="/quiz">
              <Quiz />
            </Route>
            <Route path="/results">
              <Results />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
