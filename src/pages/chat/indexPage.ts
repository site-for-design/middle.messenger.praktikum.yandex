import tpl from "./tpl.hbs?raw";
import Block from "../../services/Block";
import Unit from "../../components/Unit";
import ModalAddUser from "./Modals/ModalAddUser";
import ModalRemoveUser from "./Modals/ModalRemoveUser";
import ModalCreateChat from "./Modals/ModalCreateChat";
import ModalChangeAvatar from "./Modals/ModalChangeAvatar";
import ModalRemoveChat from "./Modals/ModalRemoveChat";
import router from "../../services/Router/Router";
import ChatList from "./ChatList";
import "./styles.scss";

const chatList = new ChatList();

class Chat extends Block {
    constructor() {
        super(
            {
                accountBtn: [
                    new Unit({
                        content: "Создать чат",
                        attrs: {
                            class: "profile",
                        },
                        events: {
                            click: () => {
                                ModalCreateChat.show();
                            },
                        },
                    }),
                    new Unit({
                        content: "Профиль",
                        attrs: {
                            class: "profile",
                        },
                        events: {
                            click: () => {
                                router.go("/settings");
                            },
                        },
                    }),
                ],
                chatList: chatList,
                modals: [
                    ModalAddUser,
                    ModalRemoveUser,
                    ModalCreateChat,
                    ModalChangeAvatar,
                    ModalRemoveChat,
                ],
                attrs: {
                    id: "chat",
                },
            },
            "section"
        );
    }
    render() {
        return this.compile(tpl, this.props);
    }
}

export default Chat;
