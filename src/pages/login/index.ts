import tpl from "./tpl.hbs?raw";
import Block from "../../services/Block";
import validateInput from "../../utils/validateInput";
import * as REGEX from "../../constants/constants";
import "./styles.scss";

const mockCredentials = {
    login: "login",
    password: "Password1",
};

const scripts = () => {
    document.querySelector("#login .form")?.addEventListener("submit", (e) => {
        e.preventDefault();

        const isFormValid =
            [
                validateInput(
                    "login",
                    (val) =>
                        val === mockCredentials.login &&
                        Boolean(val?.match(REGEX.LOGIN_REGEX)),
                    "Неверный логин"
                ),
                validateInput(
                    "password",
                    (val) =>
                        val === mockCredentials.password &&
                        Boolean(val?.match(REGEX.PASSWORD_REGEX)),
                    "Неверный пароль"
                ),
            ].filter((val) => !val).length === 0;

        if (isFormValid) {
            window.location.href = "chat";
        }

        const formData = new FormData(e.target as HTMLFormElement);

        const data: { [key: string]: FormDataEntryValue } = {};
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
