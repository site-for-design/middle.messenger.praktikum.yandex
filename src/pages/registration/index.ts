import tpl from "./tpl.hbs?raw";
import validateInput from "../../utils/validateInput";
import * as REGEX from "../../constants/constants";
import Block from "../../services/Block";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Title from "../../components/Title";
import "./styles.scss";
import { SignUpData, signUp } from "../../api/auth";
import router from "../../services/Router/Router";
import Link from "../../components/Link";
import { Store } from "../../services/Store";
import { log } from "console";

const store = new Store();

const fields = [
    new Input(
        {
            type: "text",
            name: "email",
            isRequired: true,
            text: "Почта",
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.EMAIL_REGEX)),
                    "Неверная почта",
                    target as HTMLInputElement
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
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.LOGIN_REGEX)),
                    "Неверный логин",
                    target as HTMLInputElement
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
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.NAME_REGEX)),
                    "Неверное имя",
                    target as HTMLInputElement
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
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.NAME_REGEX)),
                    "Неверная Фамилия",
                    target as HTMLInputElement
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
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.PHONE_REGEX)),
                    "Неверный телефон",
                    target as HTMLInputElement
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
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.PASSWORD_REGEX)),
                    "Минимум 8 символов",
                    target as HTMLInputElement
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
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) =>
                        val ===
                        document.querySelector<HTMLInputElement>(
                            'input[name="password"]'
                        )?.value,
                    "Пароли не совпадают",
                    target as HTMLInputElement
                );
            },

            attrs: {
                class: "input-wrap",
            },
        },
        "label"
    ),
];

const handleSubmit = async (e: Event) => {
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
                (val) => Boolean(val?.match(REGEX.PASSWORD_REGEX)),
                "Минимум 8 символов",
                (e.target as HTMLElement)?.querySelector(
                    `[name="password"]`
                ) as HTMLInputElement
            ),
            validateInput(
                (val) =>
                    val ===
                    (
                        (e.target as HTMLElement)?.querySelector(
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
        const formData = new FormData(e?.target as HTMLFormElement);

        const data = [
            "first_name",
            "second_name",
            "login",
            "email",
            "phone",
            "password",
        ].reduce(
            (acc, curr) => ({
                ...acc,
                [curr]: formData.get(curr) as string,
            }),
            {} as SignUpData
        );

        try {
            const user = await signUp(data);
            console.log(user);

            router.go("/messenger");
        } catch (e) {
            console.error(e);
        }
    }
};

class Registration extends Block {
    constructor() {
        super(
            {
                form: new Form({
                    title: new Title({ text: "Регистрация" }, "h1"),
                    fields: fields,
                    button: new Button({
                        text: "Регистрация",
                    }),
                    footer: new Link(
                        {
                            text: "Войти?",
                            attrs: { href: "/" },
                        },
                        "a"
                    ),
                    events: {
                        submit: handleSubmit,
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
    }
    render() {
        return this.compile(tpl);
    }
}

export default Registration;
