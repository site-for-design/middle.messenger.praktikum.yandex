import tpl from "./tpl.hbs?raw";
import Block from "../../services/Block";
import addEventListenerAll from "../../utils/addEventListenerAll";
import Message from "../../components/Message";
import MessagePreview from "../../components/MessagePreview";
import AccountComponent from "../account";
import mockData from "../../mockData.json";
import "./styles.scss";

const scripts = () => {
    addEventListenerAll(
        document.querySelectorAll('[data-click="toggleAccountVisibility"]'),
        "click",
        () => {
            const accountModal = document.querySelector("section#account");

            accountModal?.classList.toggle("active");
        }
    );

    document
        .querySelector('textarea[name="message"]')
        ?.addEventListener("input", (e) => {
            const target = e.target as HTMLElement;
            target.style.height = "5px";
            target.style.height = target.scrollHeight + "px";
        });
    {
        const overlay = document.querySelector(".overlay");

        overlay?.addEventListener("click", () => {
            const modal = document.querySelector(".modal.active");
            modal?.classList.toggle("active");
            overlay?.classList.toggle("active");
        });

        addEventListenerAll(
            document.querySelectorAll('[data-click="changeAvatar"]'),
            "click",
            () => {
                const modal = document.querySelector(".modal.change-avatar");
                modal?.classList.toggle("active");
                overlay?.classList.toggle("active");
            }
        );
        addEventListenerAll(
            document.querySelectorAll('[data-click="addUser"]'),
            "click",
            () => {
                const modal = document.querySelector(".modal.add-user");
                modal?.classList.toggle("active");
                overlay?.classList.toggle("active");
            }
        );
        addEventListenerAll(
            document.querySelectorAll('[data-click="removeUser"]'),
            "click",
            () => {
                const modal = document.querySelector(".modal.remove-user");
                modal?.classList.toggle("active");
                overlay?.classList.toggle("active");
            }
        );
    }
};

class Chat extends Block {
    componentDidMount() {
        scripts();
    }

    render() {
        return this.compile(tpl, this.props);
    }
}

const ChatPage = new Chat({
    account: AccountComponent,
    chatList: mockData.chat.chatList.map(
        (item) =>
            new MessagePreview({
                ...item,
                date: /\d\d:\d\d/.exec(item.date)?.[0] ?? "",
            })
    ),
    currentChat: mockData.chat.currentChat.map(
        (item) =>
            new Message({
                ...item,
                date: /\d\d:\d\d/.exec(item.date)?.[0] ?? "",
            })
    ),
});

export default ChatPage;
