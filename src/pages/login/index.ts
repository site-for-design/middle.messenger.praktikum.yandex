import tpl from "./tpl.hbs?raw";
import Block from "../../services/Block";
import validateInput from "../../utils/validateInput";
import "./styles.scss";

const mockCredentials = {
    login: "login",
    password: "password",
};

const scripts = () => {
    document.querySelector(".form")?.addEventListener("submit", (e) => {
        e.preventDefault();

        const isFormValid =
            [
                validateInput(
                    "login",
                    (val) => val === mockCredentials.login,
                    "Неверный логин"
                ),
                validateInput(
                    "password",
                    (val) => val === mockCredentials.password,
                    "Неверный пароль"
                ),
            ].filter((val) => !val).length === 0;

        if (isFormValid) {
            window.location.href = "chat";
        }

        const formData = new FormData(e.target as HTMLFormElement);

        const data = {};
        formData.forEach((val, key) => {
            data[key] = val;
        });
    });
};

export default class Login extends Block {
    componentDidMount() {
        scripts();
    }

    render() {
        return this.compile(tpl, this.props);
    }
}
