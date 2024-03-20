import * as REGEX from "../../../../constants/constants";
import { addChatUsers, getChatUsers } from "../../../../api/chats";
import { getUserByLogin } from "../../../../api/users";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Input from "../../../../components/Input";
import Modal from "../../../../components/Modal";
import Title from "../../../../components/Title";
import { store } from "../../../../services/Store";
import validateInput from "../../../../utils/validateInput";

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
            const currentChatId = store.getStateEl("currentChat")?.id;

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
                        const chatUsers = await getChatUsers(currentChatId);
                        store.set("currentChatUsers", chatUsers);

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
export default modal;
