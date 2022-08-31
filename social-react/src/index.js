import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { NotificationContextProvider } from "./context/Notification/notificationcontext";
import { AuthContextProvider } from "./context/Auth/AuthContext";
import { PostContextProvider } from "./context/Post/postContext";
import { OnlineContextProvider } from "./context/Online/onlinecontext";
ReactDOM.render(
  <NotificationContextProvider>
    <OnlineContextProvider>
      <PostContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </PostContextProvider>
    </OnlineContextProvider>
  </NotificationContextProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
