import { BlockProps } from "../../../../services/Block";
// import { RESOURCES_URL } from "../../../api/HTTPTransportYaPraktikum";
import { getChatUsers } from "../../../../api/chats";
import Modal from "../../../../components/Modal";
import Select from "../../../../components/Select";
import Title from "../../../../components/Title";
import router from "../../../../services/Router/Router";
import { StoreState } from "../../../../services/Store/Store";
import { Connect } from "../../../../services/Store";
import ModalForm from "./Form";

type HeaderChatProps = BlockProps & {
    user: StoreState["user"];
    currentChatId: StoreState["currentChatId"];
    form: any;
};

const form = new ModalForm();

class ModalRemoveUser extends Modal {
    constructor(props: HeaderChatProps) {
        super({
            content: [new Title({ text: "Удалить пользователя" }, "h3"), form],
        });
    }

    componentDidMount = async () => {
        const { currentChatId, user } = this.props as StoreState;
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
                                .filter((item) => item.id !== user?.id)
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
}

const ModalRemoveUserWithStore = Connect(ModalRemoveUser);
export default ModalRemoveUserWithStore;
