import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Note: App already wraps itself in <StoreProvider>, so it is not
// duplicated here — doing so would create two independent state trees
// that both write to the same localStorage key.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
