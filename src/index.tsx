import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import FriendsOnFour from "./FriendsOnFour";

import axios from "axios";
import swal from "sweetalert";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { data, status } = error.response;
    const redirectStatuses = [401, 403];
    console.dir(data.message);
    swal({
      title: "Oops!",
      text: data.message,
      icon: redirectStatuses.includes(status) ? "error" : "warning",
    }).then(() => {
      if (redirectStatuses.includes(status)) window.location.href = "/login";
    });
    return Promise.reject(error);
  }
);

ReactDOM.render(
  <Router>
    <FriendsOnFour />
  </Router>,
  document.getElementById("root")
);
reportWebVitals();
