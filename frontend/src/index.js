import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

import { SeatContextProvider } from "./components/SeatSelect/SeatContext";

ReactDOM.render(
  <React.StrictMode>
    <SeatContextProvider>
      <App />
    </SeatContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
