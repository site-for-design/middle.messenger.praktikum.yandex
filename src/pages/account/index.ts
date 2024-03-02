import tpl from "./tpl.hbs?raw";
import validateInput from "../../utils/validateInput";
import * as REGEX from "../../constants/constants";
import Block from "../../services/Block";
import Link from "../../components/Link";
import AccountPhoto from "./components/AccountPhoto";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Unit from "../../components/Unit";
import ModalChangeAvatar from "./components/ModalChangeAvatar";
import "./styles.scss";

const defaultContent = [
    new Input(
        {
            type: "text",
            name: "email",
            isRequired: true,
            text: "Почта",
            value: "pochta@yandex.ru",
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.EMAIL_REGEX)),
                    "Неверная почта",
                    target as HTMLInputElement
                );
            },
        },
        "li"
    ),
    new Input(
        {
            type: "login",
            name: "login",
            isRequired: true,
            text: "Логин",
            value: "lolov",
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.LOGIN_REGEX)),
                    "Неверный логин",
                    target as HTMLInputElement
                );
            },
        },
        "li"
    ),
    new Input(
        {
            type: "text",
            name: "first_name",
            isRequired: true,
            text: "Имя",
            value: "Иван",
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.NAME_REGEX)),
                    "Неверное имя",
                    target as HTMLInputElement
                );
            },
        },
        "li"
    ),
    new Input(
        {
            type: "text",
            name: "second_name",
            isRequired: true,
            text: "Фамилия",
            value: "Иванович",
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.NAME_REGEX)),
                    "Неверная Фамилия",
                    target as HTMLInputElement
                );
            },
        },
        "li"
    ),
    new Input(
        {
            type: "text",
            name: "display_name",
            isRequired: true,
            text: "Имя в чате",
            value: "Иван",
        },
        "li"
    ),
    new Input(
        {
            type: "tel",
            name: "phone",
            isRequired: true,
            text: "Телефон",
            value: "+79099673030",
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.PHONE_REGEX)),
                    "Неверный телефон",
                    target as HTMLInputElement
                );
            },
        },
        "li"
    ),
];

const passwordContent = [
    new Input(
        {
            type: "password",
            name: "oldPassword",
            isRequired: true,
            text: "Старый пароль",
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.PASSWORD_REGEX)),
                    "Неверный пароль",
                    target as HTMLInputElement
                );
            },
        },
        "li"
    ),
    new Input(
        {
            type: "password",
            name: "newPassword",
            isRequired: true,
            text: "Новый пароль",
            onChange: (target: EventTarget) => {
                validateInput(
                    (val) => Boolean(val?.match(REGEX.PASSWORD_REGEX)),
                    "Минимум 8 символов",
                    target as HTMLInputElement
                );
            },
        },
        "li"
    ),
    new Input(
        {
            type: "password",
            name: "newPassword_2",
            isRequired: true,
            text: "Повторите новый пароль",
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
        },
        "li"
    ),
];

const defaultFields = new Unit({ content: defaultContent }, "ul");
const passwordFields = new Unit(
    {
        content: passwordContent,
    },
    "ul"
);

const formAccountInfo = new Form({
    fields: defaultFields,
    button: new Button({ text: "Сохранить" }),
    attrs: {
        class: "user-info",
    },
    events: {
        submit: (e) => {
            e.preventDefault();
            let isFormValid;

            if (formAccountInfo.children.fields === defaultFields) {
                isFormValid =
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
                    ].filter((val) => !val).length === 0;
            } else {
                isFormValid =
                    [
                        validateInput(
                            (val) => Boolean(val?.match(REGEX.PASSWORD_REGEX)),
                            "Неверный пароль",
                            (e.target as HTMLElement)?.querySelector(
                                `[name="oldPassword"]`
                            ) as HTMLInputElement
                        ),
                        validateInput(
                            (val) => Boolean(val?.match(REGEX.PASSWORD_REGEX)),
                            "Минимум 8 символов",
                            (e.target as HTMLElement)?.querySelector(
                                `[name="newPassword"]`
                            ) as HTMLInputElement
                        ),
                        validateInput(
                            (val) =>
                                val ===
                                (
                                    (e.target as HTMLElement)?.querySelector(
                                        `[name="newPassword"]`
                                    ) as HTMLInputElement
                                )?.value,
                            "Пароли не совпадают",
                            (e.target as HTMLElement)?.querySelector(
                                `[name="newPassword_2"]`
                            ) as HTMLInputElement
                        ),
                    ].filter((val) => !val).length === 0;
            }

            if (isFormValid) {
                const formData = new FormData(e.target as HTMLFormElement);

                const data: { [key: string]: FormDataEntryValue } = {};
                formData.forEach((val, key) => {
                    data[key] = val;
                });
                console.log(data);

                document
                    .querySelector("section#account")
                    ?.removeAttribute("data-edit");
                formAccountInfo.setProps({
                    fields: defaultFields,
                    footer: null,
                });
            } else {
                formAccountInfo.setProps({
                    footer: new Unit(
                        {
                            content: "Неверно заполнены поля",
                            attrs: { class: "error red" },
                        },
                        "span"
                    ),
                });
            }
        },
    },
});

class Account extends Block {
    render() {
        return this.compile(tpl, this.props);
    }
}

const AccountComponent = new Account(
    {
        backBtn: new Unit(
            {
                attrs: {
                    class: "back",
                },
                events: {
                    click: () => {
                        AccountComponent.setProps({
                            attrs: {
                                class: "",
                            },
                        });
                    },
                },
            },
            "div"
        ),

        accountPhoto: new AccountPhoto({
            events: {
                click: () => {
                    ModalChangeAvatar.show();
                },
            },
        }),
        form: formAccountInfo,
        links: [
            new Link(
                {
                    text: "Изменить данные",
                    events: {
                        click: () => {
                            document
                                .querySelector("section#account")
                                ?.setAttribute("data-edit", "");
                            formAccountInfo.setProps({ fields: defaultFields });
                        },
                    },
                },
                "li"
            ),
            new Link(
                {
                    text: "Изменить пароль",
                    events: {
                        click: () => {
                            document
                                .querySelector("section#account")
                                ?.setAttribute("data-edit", "");
                            formAccountInfo.setProps({
                                fields: passwordFields,
                            });
                        },
                    },
                },
                "li"
            ),
            new Link(
                {
                    text: "Выйти",
                    attrs: {
                        class: "red",
                    },
                },
                "li"
            ),
        ],
        modals: ModalChangeAvatar,

        attrs: { id: "account" },
    },
    "section"
);

export default AccountComponent;
