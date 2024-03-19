import * as REGEX from "../../../constants/constants";
import { addChatUsers, createChat, getChats } from "../../../api/chats";
import { getUserByLogin } from "../../../api/users";
import Button from "../../../components/Button";
import Form from "../../../components/Form";
import Input from "../../../components/Input";
import Modal from "../../../components/Modal";
import Title from "../../../components/Title";
import validateInput from "../../../utils/validateInput";
import { Store } from "../../../services/Store";
import ModalRemoveUserWithStore from "./ModalRemoveUser";
import { setChatList } from "../../../services/Store/Actions";

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
    const modal = new ModalRemoveUserWithStore();
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
                    title: formData.get("title") as string,
                };

                try {
                    await createChat(data);
                    const chats = await getChats();
                    setChatList(chats);

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
