import { store, StoreState } from "./Store";

export const setCurrentUser = (user: StoreState["user"]) => {
  store.set("user", user);
};

export const setCurrentChat = (currentChat: StoreState["currentChat"]) => {
  store.set("currentChat", currentChat);
};
export const setCurrentChatMessages = (
  messages: StoreState["currentChatMessages"],
) => {
  store.set("currentChatMessages", messages);
};
export const setCurrentChatUsers = (users: StoreState["currentChatUsers"]) => {
  store.set("currentChatUsers", users);
};

export const setChatList = (chats: StoreState["chatList"]) => {
  store.set("chatList", chats);
};
