import mockData from "./mockData.json";
import Block from "./services/Block";
import LoginPage from "./pages/login";
import RegistrationPage from "./pages/registration";
import ChatPage from "./pages/chat";
import Account from "./pages/account";
import ErrorPage from "./pages/error";
import "./assets/scss/styles.scss";
import Button from "./components/Button";
import Form from "./components/Form";
import Input from "./components/Input";
import MessagePreview from "./components/MessagePreview";
import Message from "./components/Message";

const chat = new ChatPage({
    account: new Account({}),
    chatList: mockData.chat.chatList.map(
        (item) =>
            new MessagePreview({
                ...item,
                date: /\d\d:\d\d/.exec(item.date)?.[0] ?? "",
            })
    ),
    currentChat: mockData.chat.currentChat.map(
        (item) =>
            new Message({
                ...item,
                date: /\d\d:\d\d/.exec(item.date)?.[0] ?? "",
            })
    ),
});
// setTimeout(() => {
//     chat.setProps({ currentChat: [] });
// }, 1000);

const routes: Record<string, Block> = {
    homepage: new LoginPage({
        form: new Form({
            title: "Вход",
            fields: [
                new Input({
                    type: "text",
                    name: "login",
                    isRequired: true,
                    // Text: this?.value ?? "",
                    text: "Логин",
                    events: {
                        change() {
                            console.log(333);
                        },
                    },
                }),
                new Input({
                    type: "password",
                    name: "password",
                    isRequired: true,
                    text: "Пароль",
                }),
            ],
            button: new Button({ text: "Вход" }),
            footer: '<a href="/registration" class="link">Нет аккаунта?</a>',
        }),
    }),
    registration: new RegistrationPage({}),
    chat: chat,
    error500: new ErrorPage({
        errorCode: "500 ",
        justification: "Мы уже фиксим",
    }),
};

const pathName = window.location.pathname.slice(1);

const res = pathName
    ? routes[pathName]
        ? routes[pathName]
        : new ErrorPage({
              errorCode: "404",
              justification: "Не туда попали",
          })
    : routes.homepage;

document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    if (app) {
        app.appendChild(res.getContent());
    }
});

// setTimeout(() => {
//     app.innerHTML = "";
//     app.appendChild(res.getContent());
// }, 3000);
