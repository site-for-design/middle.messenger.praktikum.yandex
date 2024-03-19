import { Chat } from "../../api/chats";
import { User } from "../../api/types";
import { Store } from "./Store";

const store = new Store();

export const setCurrentUser = (user: User) => {
    store.set("user", user);
};

export const setCurrentChatId = (id: number) => {
    store.set("currentChatId", id);
};
export const setCurrentChat = (currentChat: any) => {
    store.set("currentChat", currentChat);
};

export const setChatList = (chats: Chat[]) => {
    store.set("chatList", chats);
};
