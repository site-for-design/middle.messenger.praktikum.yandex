import mockData from "./mockData.json";

import loginPage from "./pages/login";
import registrationPage from "./pages/registration";
import chatPage from "./pages/chat";
import errorPage from "./pages/error";
import "./assets/scss/styles.scss";

const routes = {
 "/": loginPage(),
 "/registration": registrationPage(),
 "/chat": chatPage({
  chatList: mockData.chat.chatList.map((item) => ({
   ...item,
   date: item.date.match(/\d\d:\d\d/)[0],
  })),
  currentChat: mockData.chat.currentChat.map((item) => ({
   ...item,
   date: item.date.match(/\d\d:\d\d/)[0],
  })),
 }),
 "/500": errorPage({
  errorCode: "500 ",
  justification: "Мы уже фиксим",
 }),
};

const res = routes[window.location.pathname]
 ? routes[window.location.pathname]
 : errorPage({
    errorCode: "404",
    justification: "Не туда попали",
   });

document.addEventListener("DOMContentLoaded", function (e) {
 document.getElementById("app").innerHTML = res.html;
 res.js();
});
