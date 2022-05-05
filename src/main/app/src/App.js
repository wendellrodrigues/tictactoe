import React, { useEffect, useState, Fragment } from "react";
import { Provider } from "react-redux";
import store from "./store";
import Landing from "./components/Landing";
import styled from "styled-components";

function App() {
  return (
    <Provider store={store}>
      <Fragment>
        <Landing />
      </Fragment>
    </Provider>
  );
}

export default App;
