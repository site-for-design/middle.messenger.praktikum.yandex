import tpl from "./tpl.hbs?raw";
import Block from "../../services/Block";
import validateInput from "../../utils/validateInput";
import * as REGEX from "../../constants/constants";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Link from "../../components/Link";
import Title from "../../components/Title";
import "./styles.scss";

const mockCredentials = {
    login: "login",
    password: "Password1",
};

const fields = [
    new Input(
        {
            type: "text",
            name: "login",
            isRequired: true,
            text: "Логин",
            onChange: (e: Event) => {
                validateInput(
                    (val) =>
                        val === mockCredentials.login &&
                        Boolean(val?.match(REGEX.LOGIN_REGEX)),
                    "Неверный логин",
                    e.target as HTMLInputElement
                );
            },
            attrs: {
                class: "input-wrap",
            },
        },
        "label"
    ),
    new Input(
        {
            type: "password",
            name: "password",
            isRequired: true,
            text: "Пароль",
            onChange: (e: Event) => {
                validateInput(
                    (val) =>
                        val === mockCredentials.password &&
                        Boolean(val?.match(REGEX.PASSWORD_REGEX)),
                    "Неверный пароль",
                    e.target as HTMLInputElement
                );
            },
            attrs: {
                class: "input-wrap",
            },
        },
        "label"
    ),
];

class Login extends Block {
    render() {
        return this.compile(tpl, this.props);
    }
}

const LoginPage = new Login(
    {
        form: new Form({
            title: new Title({ text: "Вход" }, "h1"),
            fields: fields,
            button: new Button({ text: "Вход" }),
            footer: new Link(
                {
                    text: "Нет аккаунта?",
                    attrs: { href: "/registration" },
                },
                "a"
            ),
            events: {
                submit: (e: Event) => {
                    e.preventDefault();

                    const isFormValid =
                        [
                            validateInput(
                                (val) => Boolean(val?.match(REGEX.LOGIN_REGEX)),
                                "Неверный логин",
                                (e.target as HTMLElement)?.querySelector(
                                    `[name="login"]`
                                ) as HTMLInputElement
                            ),
                            validateInput(
                                (val) =>
                                    Boolean(val?.match(REGEX.PASSWORD_REGEX)),
                                "Неверный пароль",
                                (e.target as HTMLElement)?.querySelector(
                                    `[name="password"]`
                                ) as HTMLInputElement
                            ),
                        ].filter((val) => !val).length === 0;

                    if (isFormValid) {
                        const formData = new FormData(
                            e.target as HTMLFormElement
                        );

                        const data: { [key: string]: FormDataEntryValue } = {};
                        formData.forEach((val, key) => {
                            data[key] = val;
                        });
                    }
                },
            },
            attrs: {
                class: "form",
            },
        }),
        attrs: {
            id: "login",
        },
    },
    "section"
);

export default LoginPage;
