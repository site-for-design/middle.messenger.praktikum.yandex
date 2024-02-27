import Block from "./services/Block";
import Button from "./components/Button";
import LoginPage from "./pages/login";
import RegistrationPage from "./pages/registration";
import ChatPage from "./pages/chat";
import ErrorPage from "./pages/error";
import "./assets/scss/styles.scss";

let i = 0;

const btn = new Button({
    text: "Регистрация",
    events: {
        click: () => {
            console.log(btn);
            btn.setProps({ text: `${btn.props.text}${i++}` });
        },
    },
});

const routes: Record<string, Block> = {
    btn: btn,
    homepage: LoginPage,
    registration: RegistrationPage,
    chat: ChatPage,
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

function render(query: string, block: Block) {
    const root = document.querySelector(query);
    root?.appendChild(block.getContent());
    return root;
}

render("#app", res);
