import { createChat, getChats } from "../../../../api/chats";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Input from "../../../../components/Input";
import Modal from "../../../../components/Modal";
import Title from "../../../../components/Title";
import { store } from "../../../../services/Store";

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
      const title = new FormData(e?.target as HTMLFormElement).get(
        "title",
      ) as string;

      if (title) {
        try {
          await createChat({ title });
          const chats = await getChats();
          store.set("chatList", chats);

          modal.hide();
        } catch (e) {
          console.error(e);
        }
      } else {
        alert("Введите название чата");
      }
    },
  },
});

const modal = new Modal({
  content: [new Title({ text: "Создать чат" }, "h3"), form],
});
export default modal;
