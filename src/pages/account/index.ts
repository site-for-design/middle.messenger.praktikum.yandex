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
import {
    ChangeUserPasswordData,
    changeUserPassword,
    changeUserProfile,
} from "../../api/users";
import { logOut } from "../../api/auth";
import { User } from "../../api/types";
import "./styles.scss";
import Title from "../../components/Title";
import router from "../../services/Router/Router";
import { store, setCurrentUser } from "../../services/Store";

const currentUser = store.getStateEl("user");
const formAccountInfoTitle = new Title({ text: "" }, "h2");

const defaultFieldsList = [
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
        },
        "li"
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
        },
        "li"
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
        },
        "li"
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
        },
        "li"
    ),
    new Input(
        {
            type: "text",
            name: "display_name",
            isRequired: true,
            text: "Имя в чате",
        },
        "li"
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
        },
        "li"
    ),
];

const AccountPhotoComponent = new AccountPhoto({
    events: {
        click: () => {
            ModalChangeAvatar.show();
        },
    },
});

const setAccountProps = async (userInfo: User) => {
    setCurrentUser(userInfo);

    defaultFieldsList.forEach((field) => {
        field.setProps({ value: userInfo[field.props.name as keyof User] });
    });
    AccountPhotoComponent.setProps({ src: userInfo.avatar });
    formAccountInfoTitle.setProps({ text: userInfo.display_name });
};

if (currentUser) {
    setAccountProps(currentUser);
}

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

const defaultFields = new Unit({ content: defaultFieldsList }, "ul");

const passwordFields = new Unit(
    {
        content: passwordContent,
    },
    "ul"
);

const handleFormAccountSubmit = async (e: Event) => {
    e.preventDefault();
    let isFormValid;
    let data;
    const formData = new FormData(e?.target as HTMLFormElement);

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

        data = [
            "first_name",
            "second_name",
            "display_name",
            "login",
            "email",
            "phone",
        ].reduce(
            (acc, curr) => ({
                ...acc,
                [curr]: formData.get(curr) as string,
            }),
            {} as User
        );

        try {
            const res = await changeUserProfile(data);
            setAccountProps(res);
        } catch (e) {
            console.error(e);
        }
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

        data = ["oldPassword", "newPassword"].reduce(
            (acc, curr) => ({
                ...acc,
                [curr]: formData.get(curr) as string,
            }),
            {} as ChangeUserPasswordData
        );

        try {
            await changeUserPassword(data);
        } catch (e) {
            console.error(e);
        }
    }

    if (isFormValid) {
        document.querySelector("section#account")?.removeAttribute("data-edit");

        formAccountInfo.setProps({
            fields: defaultFields,
            footer: new Unit(),
        });
    } else {
        formAccountInfo.setProps({
            footer: new Unit(
                {
                    content: "Неверно заполнены поля",
                    attrs: { class: "error-message red" },
                },
                "span"
            ),
        });
    }
};

const formAccountInfo = new Form({
    title: formAccountInfoTitle,
    fields: defaultFields,
    button: new Button({ text: "Сохранить" }),
    attrs: {
        class: "user-info",
    },
    events: {
        submit: handleFormAccountSubmit,
    },
});

const handleLogOut = async () => {
    try {
        await logOut();
        store.removeState();
        router.go("/");
    } catch (e) {
        console.error(e);
    }
};

export default class Account extends Block {
    constructor() {
        super(
            {
                backBtn: new Unit(
                    {
                        attrs: {
                            class: "back",
                        },
                        events: {
                            click: () => {
                                router.back();
                            },
                        },
                    },
                    "div"
                ),
                accountPhoto: AccountPhotoComponent,
                form: formAccountInfo,
                links: new Unit(
                    {
                        content: [
                            new Link(
                                {
                                    text: "Изменить данные",
                                    events: {
                                        click: () => {
                                            document
                                                .querySelector(
                                                    "section#account"
                                                )
                                                ?.setAttribute("data-edit", "");
                                            formAccountInfo.setProps({
                                                fields: defaultFields,
                                            });
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
                                                .querySelector(
                                                    "section#account"
                                                )
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
                                    events: {
                                        click: handleLogOut,
                                    },
                                    attrs: {
                                        class: "red",
                                    },
                                },
                                "li"
                            ),
                        ],
                        attrs: {
                            class: "links",
                        },
                    },
                    "ul"
                ),
                modals: ModalChangeAvatar,

                attrs: { id: "account", class: "active" },
            },
            "section"
        );
    }

    render() {
        return this.compile(tpl, this.props);
    }
}
