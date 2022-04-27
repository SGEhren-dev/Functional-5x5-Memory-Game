import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App.js";

//-- Get the root element so we can render on it
const root = document.getElementById("root");

//-- Initiate the render using our App code on the root element
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  root
);
