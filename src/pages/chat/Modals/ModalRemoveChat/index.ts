import { deleteChat } from "../../../../api/chats";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Modal from "../../../../components/Modal";
import Title from "../../../../components/Title";
import router from "../../../../services/Router/Router";
import { store } from "../../../../services/Store";

const form = new Form({
  fields: null,
  events: {
    submit: async (e: Event) => {
      e.preventDefault();

      const currentChatId = store.getStateEl("currentChat")?.id;

      if (currentChatId) {
        try {
          const deletedChat = await deleteChat({
            chatId: currentChatId,
          });
          if (deletedChat) {
            store.set(
              "chatList",
              store
                .getStateEl("chatList")
                .filter((chat) => chat.id !== deletedChat.result.id),
            );
            store.set("currentChat", null);
            store.set("currentChatMessages", []);
            store.set("currentChatUsers", []);
            modal.hide();
            alert("Чат удален");
            router.go("/messenger");
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
  },
  button: new Button({
    text: "Удалить",
  }),
});

const modal = new Modal({
  content: [new Title({ text: "Вы точно хотите удалить чат?" }, "h3"), form],
});
export default modal;
