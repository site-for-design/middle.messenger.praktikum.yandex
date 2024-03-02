import tpl from "./tpl.hbs?raw";
import validateInput from "../../utils/validateInput";
import * as REGEX from "../../constants/constants";
import Block from "../../services/Block";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Title from "../../components/Title";
import "./styles.scss";

class Registration extends Block {
    render() {
        return this.compile(tpl);
    }
}

const fields = [
    new Input(
        {
            type: "text",
            name: "email",
            isRequired: true,
            text: "Почта",
            onChange: (e: Event) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.EMAIL_REGEX)),
                    "Неверная почта",
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
            type: "login",
            name: "login",
            isRequired: true,
            text: "Логин",
            onChange: (e: Event) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.LOGIN_REGEX)),
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
            type: "text",
            name: "first_name",
            isRequired: true,
            text: "Имя",
            onChange: (e: Event) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.NAME_REGEX)),
                    "Неверное имя",
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
            type: "text",
            name: "second_name",
            isRequired: true,
            text: "Фамилия",
            onChange: (e: Event) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.NAME_REGEX)),
                    "Неверная Фамилия",
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
            type: "tel",
            name: "phone",
            isRequired: true,
            text: "Телефон",
            onChange: (e: Event) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.PHONE_REGEX)),
                    "Неверный телефон",
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
                    (val) => Boolean(val?.match(REGEX.PASSWORD_REGEX)),
                    "Минимум 8 символов",
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
            name: "password_2",
            isRequired: true,
            text: "Пароль",
            onChange: (e: Event) => {
                validateInput(
                    (val) =>
                        val ===
                        document.querySelector<HTMLInputElement>(
                            'input[name="password"]'
                        )?.value,
                    "Пароли не совпадают",
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

const RegistrationPage = new Registration(
    {
        form: new Form({
            title: new Title({ text: "Регистрация" }, "h1"),
            fields: fields,
            button: new Button({
                text: "Регистрация",
            }),
            footer: '<a href="/" class="link">Войти?</a>',
            events: {
                submit: (e: Event) => {
                    e.preventDefault();

                    const isFormValid =
                        [
                            validateInput(
                                (val) => Boolean(val?.match(REGEX.EMAIL_REGEX)),
                                "Неверная почта",
                                (e.target as HTMLElement)?.querySelector(
                                    `[name="email"]`
                                ) as HTMLInputElement
                            ),
                            validateInput(
                                (val) => Boolean(val?.match(REGEX.LOGIN_REGEX)),
                                "Неверный логин",
                                (e.target as HTMLElement)?.querySelector(
                                    `[name="login"]`
                                ) as HTMLInputElement
                            ),
                            validateInput(
                                (val) => Boolean(val?.match(REGEX.NAME_REGEX)),
                                "Неверное имя",
                                (e.target as HTMLElement)?.querySelector(
                                    `[name="first_name"]`
                                ) as HTMLInputElement
                            ),
                            validateInput(
                                (val) => Boolean(val?.match(REGEX.NAME_REGEX)),
                                "Неверная Фамилия",
                                (e.target as HTMLElement)?.querySelector(
                                    `[name="second_name"]`
                                ) as HTMLInputElement
                            ),
                            validateInput(
                                (val) => Boolean(val?.match(REGEX.PHONE_REGEX)),
                                "Неверный телефон",
                                (e.target as HTMLElement)?.querySelector(
                                    `[name="phone"]`
                                ) as HTMLInputElement
                            ),
                            validateInput(
                                (val) =>
                                    Boolean(val?.match(REGEX.PASSWORD_REGEX)),
                                "Минимум 8 символов",
                                (e.target as HTMLElement)?.querySelector(
                                    `[name="password"]`
                                ) as HTMLInputElement
                            ),
                            validateInput(
                                (val) =>
                                    val ===
                                    (
                                        (
                                            e.target as HTMLElement
                                        )?.querySelector(
                                            `[name="password"]`
                                        ) as HTMLInputElement
                                    )?.value,
                                "Пароли не совпадают",
                                (e.target as HTMLElement)?.querySelector(
                                    `[name="password_2"]`
                                ) as HTMLInputElement
                            ),
                        ].filter((val) => !val).length === 0;

                    if (isFormValid) {
                        alert("Вы успешно зарегестрированы!");
                        const formData = new FormData(
                            e?.target as HTMLFormElement
                        );

                        const data: { [key: string]: FormDataEntryValue } = {};
                        formData.forEach((val, key) => {
                            data[key] = val;
                        });
                        console.log(data);
                    }
                },
            },
            attrs: {
                class: "form",
            },
        }),
        attrs: {
            id: "registration",
        },
    },
    "section"
);

export default RegistrationPage;
