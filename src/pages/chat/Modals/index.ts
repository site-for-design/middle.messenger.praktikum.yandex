import * as REGEX from "../../../constants/constants";
import {
    addChatUsers,
    createChat,
    deleteChatUsers,
    getChatUsers,
} from "../../../api/chats";
import { getUserByLogin } from "../../../api/users";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Input from "../../../components/Input";
import Modal from "../../../components/Modal";
import Title from "../../../components/Title";
import validateInput from "../../../utils/validateInput";
import Select from "../../../components/Select";
import router from "../../../services/Router/Router";
import { Store } from "../../../services/Store";

const store = new Store();

export const modalAddUser = () => {
    const form = new Form({
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
        events: {
            submit: async (e) => {
                e.preventDefault();
                const currentChatId = store.getStateEl("currentChatId");

                const userLogin = validateInput(
                    (val) => Boolean(val?.match(REGEX.LOGIN_REGEX)),
                    "Неверный логин",
                    (e.target as HTMLElement)?.querySelector(
                        `[name="login"]`
                    ) as HTMLInputElement
                );

                if (userLogin && currentChatId) {
                    try {
                        const user = await getUserByLogin({
                            login: userLogin,
                        });

                        if (user[0]) {
                            await addChatUsers({
                                users: [user[0].id],
                                chatId: currentChatId,
                            });
                            modal.hide();
                            alert("Пользователь Добавлен");
                        } else {
                            alert("Такого пользователя не существует");
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            },
        },
    });

    const modal = new Modal({
        content: [new Title({ text: "Добавить пользователя" }, "h3"), form],
    });
    return modal;
};

export const modalRemoveUser = () => {
    const currentChatId = store.getStateEl("currentChatId");
    const currentUser = store.getStateEl("user");
    const form = new Form({
        fields: [],
        events: {
            submit: async (e: Event) => {
                e.preventDefault();

                const userId = new FormData(e.target as HTMLFormElement).get(
                    "userId"
                );

                if (userId && currentChatId) {
                    try {
                        const res = await deleteChatUsers({
                            users: [Number(userId)],
                            chatId: Number(currentChatId),
                        });
                        if (res === "OK") {
                            modal.hide();
                            alert("Пользователь удален");
                        }
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert("Такого пользователя не существует");
                }
            },
        },
        button: new Button({
            text: "Удалить",
        }),
    });
    const modal = new Modal({
        content: [new Title({ text: "Удалить пользователя" }, "h3"), form],
    });

    modal.componentDidMount = async () => {
        try {
            if (currentChatId) {
                const users = await getChatUsers(currentChatId);

                form.setProps({
                    fields: [
                        new Select({
                            name: "userId",
                            isRequired: true,
                            text: "Пользователь",
                            options: users
                                .filter((item) => item.id !== currentUser?.id)
                                .map((item) => ({
                                    value: item.id,
                                    text: item.login,
                                })),
                        }),
                    ],
                });
            }
        } catch (e) {
            if (e.reason === "No chat") {
                router.go("/messenger");
            }
        }
    };
    return modal;
};

export const modalCreateChat = () => {
    const form = new Form({
        fields: [
            new Input({
                type: "text",
                name: "title",
                isRequired: true,
                text: "Название",
            }),
        ],
        button: new Button({
            text: "Создать",
        }),
        events: {
            submit: async (e: Event) => {
                e.preventDefault();
                const formData = new FormData(e?.target as HTMLFormElement);

                const data = {
                    title: formData.get("title"),
                };

                try {
                    await createChat(data);

                    modal.hide();
                } catch (e) {
                    console.error(e);
                }
            },
        },
    });
    const modal = new Modal({
        content: [new Title({ text: "Создать чат" }, "h3"), form],
    });
    return modal;
};
