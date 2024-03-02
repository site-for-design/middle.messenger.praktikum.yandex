import tpl from "./tpl.hbs?raw";
import * as REGEX from "../../constants/constants";
import Block from "../../services/Block";
import Message from "../../components/Message";
import MessagePreview from "../../components/MessagePreview";
import Modal from "../../components/Modal";
import Title from "../../components/Title";
import Form from "../../components/Form";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Unit from "../../components/Unit";
import Dropdown from "../../components/Dropdown";
import Image from "../../components/Image";
import validateInput from "../../utils/validateInput";
import AccountComponent from "../account";
import mockData from "../../mockData.json";
import "./styles.scss";

class Chat extends Block {
    render() {
        return this.compile(tpl, this.props);
    }
}

const modalAddUser = new Modal({
    content: [
        new Title({ text: "Добавить пользователя" }, "h3"),
        new Form({
            fields: [
                new Input({
                    type: "text",
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
                }),
            ],
            button: new Button({
                text: "Добавить",
            }),
        }),
    ],
});

const modalRemoveUser = new Modal({
    content: [
        new Title({ text: "Удалить пользователя" }, "h3"),
        new Form({
            fields: [
                new Input({
                    type: "text",
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
                }),
            ],
            button: new Button({
                text: "Удалить",
            }),
        }),
    ],
});

const ChatPage = new Chat({
    accountBtn: new Unit({
        content: "Профиль",
        attrs: {
            class: "profile",
        },
        events: {
            click: () => {
                AccountComponent.setProps({
                    attrs: {
                        class: "active",
                    },
                });
            },
        },
    }),
    account: AccountComponent,
    chatList: mockData.chat.chatList.map(
        (item) =>
            new MessagePreview({
                ...item,
                date: /\d\d:\d\d/.exec(item.date)?.[0] ?? "",
            })
    ),
    userActions: new Dropdown({
        icon: "<img src='img/actions.svg' alt='Добавить/Удалить пользователя'>",
        dropdown: new Unit(
            {
                content: [
                    new Unit(
                        {
                            content: [
                                new Image({
                                    attrs: {
                                        src: "img/add.svg",
                                        alt: "Добавить пользователя",
                                    },
                                }),
                                new Unit(
                                    { content: "Добавить пользователя" },
                                    "span"
                                ),
                            ],
                            events: {
                                click: () => {
                                    modalAddUser.show();
                                },
                            },
                        },
                        "li"
                    ),
                    new Unit(
                        {
                            content: [
                                new Image({
                                    attrs: {
                                        src: "img/remove.svg",
                                        alt: "Удалить пользователя",
                                    },
                                }),
                                new Unit(
                                    { content: "Удалить пользователя" },
                                    "span"
                                ),
                            ],
                            events: {
                                click: () => {
                                    modalRemoveUser.show();
                                },
                            },
                        },
                        "li"
                    ),
                ],
            },
            "ul"
        ),
    }),
    currentChat: mockData.chat.currentChat.map(
        (item) =>
            new Message({
                ...item,
                date: /\d\d:\d\d/.exec(item.date)?.[0] ?? "",
            })
    ),
    modals: [modalAddUser, modalRemoveUser],
    textMessage: new Unit(
        {
            attrs: {
                name: "message",
                placeholder: "Сообщение",
            },
            events: {
                input: (e) => {
                    const target = e.target as HTMLElement;
                    target.style.height = "5px";
                    target.style.height = target.scrollHeight + "px";
                },
            },
        },
        "textarea"
    ),
});

export default ChatPage;
