import ChatList from "./indexPage";
import {
  Connect,
  store,
  setCurrentChat,
  setCurrentChatMessages,
  setCurrentChatUsers,
  setChatList,
} from "../../../services/Store";
import convertDate from "../../../utils/convertDate";
import ChatListItem from "./ChatListItem";
import ChatWS from "../../../api/ChatWS";
import router from "../../../services/Router/Router";
import { getChatUsers, getChats } from "../../../api/chats";
import { currentChat as currentChatInstance } from "../";

const MESSAGES_OFFSET = 20;
const chatWS = new ChatWS();

chatWS.onMessage = () => {
  setCurrentChatMessages(chatWS.messages);

  if (chatWS.messages.length <= MESSAGES_OFFSET) {
    currentChatInstance._element.scrollTop =
      currentChatInstance._element.scrollHeight;
  }
};

const connectChatWS = async () => {
  const user = store.getStateEl("user");

  const currentChatIdUrl = Number(
    new URLSearchParams(window.location.search).get("chatId"),
  );

  const currentChatId = store.getStateEl("currentChat")?.id;

  if (!!currentChatId && !!currentChatIdUrl) {
    try {
      if (user) {
        const chats = await getChats();
        setChatList(chats);

        const currentChat = store
          .getStateEl("chatList")
          .find(
            (chat) =>
              chat.id ===
              (currentChatId !== currentChatIdUrl
                ? currentChatIdUrl
                : currentChatId),
          );

        if (currentChat) {
          setCurrentChat(currentChat);
          // currentChatId = currentChat.id;
        }

        if (currentChat?.id) {
          await chatWS.connect(user.id, currentChat.id);

          const currentChatUsers = await getChatUsers(currentChat.id);
          setCurrentChatUsers(currentChatUsers);
        }
      } else {
        console.error(currentChatId);
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    try {
      const chats = await getChats();
      setChatList(chats);
    } catch (e) {
      console.error(e);
    }

    router.go("/messenger");
    setCurrentChat(null);
    setCurrentChatUsers([]);
    setCurrentChatMessages([]);
  }
};
connectChatWS();

const ChatListWithStore = Connect(ChatList, (state) => {
  return {
    content: state.chatList.map(
      (chat) =>
        new ChatListItem(
          {
            name: chat.title,
            avatar: chat.avatar,
            message: chat.last_message?.content,
            date: chat.last_message?.time
              ? convertDate(chat.last_message.time).time
              : null,
            countMessages: chat.unread_count,
            events: {
              click: async function () {
                router.go(`/messenger?chatId=${chat.id}`);
                setCurrentChat(chat);

                await connectChatWS();
              },
            },
            attrs: {
              class: [
                "chat-list__item",
                chat.id === state.currentChat?.id ? "active" : "",
              ].join(" "),
            },
          },
          "li",
        ),
    ),
  };
});
export default ChatListWithStore;
