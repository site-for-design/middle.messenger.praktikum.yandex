import { deleteChatUsers } from "../../../../api/chats";
import Button from "../../../../components/Button";
import Form from "../../../../components/Form";
import Modal from "../../../../components/Modal";
import Select from "../../../../components/Select";
import Title from "../../../../components/Title";
import { Connect, store } from "../../../../services/Store";

const UsersSelect = Connect(Select, (state) => {
  return {
    options: state.currentChatUsers
      .filter((item) => item.id !== state.user?.id)
      .map((item) => ({
        value: item.id,
        text: item.login,
      })),
  };
});

const form = new Form({
  fields: [
    new UsersSelect({
      name: "userId",
      isRequired: true,
      text: "Пользователь",
      options: [],
    }),
  ],
  events: {
    submit: async (e: Event) => {
      e.preventDefault();

      const userId = Number(
        new FormData(e.target as HTMLFormElement).get("userId"),
      );

      const currentChatId = store.getStateEl("currentChat")?.id;

      if (userId && currentChatId) {
        try {
          const res = await deleteChatUsers({
            users: [userId],
            chatId: currentChatId,
          });
          if (res === "OK") {
            store.set(
              "currentChatUsers",
              store
                .getStateEl("currentChatUsers")
                .filter((user) => user.id !== userId),
            );
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
export default modal;
