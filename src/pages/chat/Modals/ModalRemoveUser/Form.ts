import { Connect } from "../../../../services/Store";
import { deleteChatUsers } from "../../../../api/chats";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import { BlockProps } from "../../../../services/Block";

class ModalForm extends Form {
    constructor(props: BlockProps) {
        super({
            fields: [],
            events: {
                submit: async (e: Event) => {
                    e.preventDefault();

                    const userId = new FormData(
                        e.target as HTMLFormElement
                    ).get("userId");

                    if (userId && props.currentChatId) {
                        try {
                            const res = await deleteChatUsers({
                                users: [Number(userId)],
                                chatId: Number(props.currentChatId),
                            });
                            if (res === "OK") {
                                this.hide();
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
    }
}

const ModalFormWithStore = Connect(ModalForm);

export default ModalFormWithStore;
