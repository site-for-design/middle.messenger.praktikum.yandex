import Block from "./services/Block";
import LoginPage from "./pages/login";
import RegistrationPage from "./pages/registration";
import ChatPage from "./pages/chat";
import ErrorPage from "./pages/error";
import "./assets/scss/styles.scss";

const routes: Record<string, Block> = {
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
