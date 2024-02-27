import tpl from "./tpl.hbs?raw";
import Block from "../../services/Block";
import validateInput from "../../utils/validateInput";
import * as REGEX from "../../constants/constants";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Input from "../../components/Input";
import "./styles.scss";

const mockCredentials = {
    login: "login",
    password: "Password1",
};

class Login extends Block {
    render() {
        return this.compile(tpl, this.props);
    }
}

const LoginPage = new Login({
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
        events: {
            click: (e) => {
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
            },
        },
    }),
});

export default LoginPage;
