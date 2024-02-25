import mockData from "./mockData.json";
import Block from "./services/Block";
import Button from "./components/Button";
import Form from "./components/Form";
import Input from "./components/Input";
import MessagePreview from "./components/MessagePreview";
import Message from "./components/Message";
import LoginPage from "./pages/login";
import RegistrationPage from "./pages/registration";
import ChatPage from "./pages/chat";
import Account from "./pages/account";
import ErrorPage from "./pages/error";
import "./assets/scss/styles.scss";

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

const routes: Record<string, Block> = {
    homepage: new LoginPage({
        form: new Form({
            title: "Вход",
            fields: [
                new Input({
                    type: "text",
                    name: "login",
                    isRequired: true,
                    text: "Логин",
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
    registration: new RegistrationPage({
        form: new Form({
            title: "Регистрация",
            fields: [
                new Input({
                    type: "email",
                    name: "email",
                    isRequired: true,
                    text: "Почта",
                }),
                new Input({
                    type: "login",
                    name: "login",
                    isRequired: true,
                    text: "Логин",
                }),
                new Input({
                    type: "text",
                    name: "first_name",
                    isRequired: true,
                    text: "Имя",
                }),
                new Input({
                    type: "text",
                    name: "second_name",
                    isRequired: true,
                    text: "Фамилия",
                }),
                new Input({
                    type: "tel",
                    name: "phone",
                    isRequired: true,
                    text: "Телефон",
                }),
                new Input({
                    type: "password",
                    name: "password",
                    isRequired: true,
                    text: "Пароль",
                }),
                new Input({
                    type: "password",
                    name: "password_2",
                    isRequired: true,
                    text: "Пароль",
                }),
            ],
            button: new Button({ text: "Регистрация" }),
            footer: '<a href="/" class="link">Войти?</a>',
        }),
    }),
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
