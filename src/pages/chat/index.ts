import IndexPage from "./indexPage";
import { Connect } from "../../services/Store";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Unit from "../../components/Unit";
import AttachFileDropdown from "./AttachFileDropdown";
import HeaderChat from "./HeaderChat";
import ChatWS from "../../api/ChatWS";
import CurrentChat from "./CurrentChat";

const chatWS = new ChatWS();

const headerChat = new HeaderChat();

export const currentChat = new CurrentChat();

const form = new Form({
  fields: [
    AttachFileDropdown,
    new Unit({
      content: new Unit(
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
        "textarea",
      ),
      attrs: {
        class: "type-text",
      },
    }),
  ],
  button: new Button({
    text: "",
    attrs: { class: "submit" },
  }),
  attrs: {
    class: "footer",
  },
  events: {
    submit: (e: SubmitEvent) => {
      e.preventDefault();
      const message = (
        new FormData(e?.target as HTMLFormElement).get("message") as string
      )?.trim();

      if (message) {
        chatWS.sendMessage(message);
      }

      (e.target as HTMLFormElement).reset();
    },
    keydown: function (e: KeyboardEvent) {
      if (e.shiftKey && e.key === "Enter") {
        e.stopPropagation();
      } else if (e.key === "Enter") {
        const formData = new FormData(this as HTMLFormElement);

        const message = formData.get("message");

        if (message) {
          chatWS.sendMessage(message as string);
        }

        (this as HTMLFormElement).reset();

        e.stopPropagation();
      }
    },
  },
});

const emptyChat = new Unit(
  {
    content: "Выберите чат чтобы отправить сообщение",
    attrs: { class: "empty" },
  },
  "h3",
);

const Page = Connect(IndexPage, (state) => {
  return {
    chat: state.currentChat ? [headerChat, currentChat, form] : emptyChat,
  };
});
export default Page;
