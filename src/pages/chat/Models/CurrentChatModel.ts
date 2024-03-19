import * as api from "../../../api/chats";
import Block from "../../../services/Block";
import { Store, setChatList } from "../../../services/Store";

const store = new Store();

export default class CurrentChatModel {
    view: Block;
    constructor(view: Block) {
        this.view = view;
    }
    getChatsList = async () => {
        const chats = await api.getChats();
        return chats;
    };
    // setChatsList = async (chats: api.Chat[]) => {
    //     setChatList(chats);
    // };
    deleteChat = async (chatId: number) => {
        try {
            await api.deleteChat({ chatId });
            setChatList(
                store.getStateEl("chatList").filter((chat) => {
                    return chat.id !== chatId;
                })
            );
        } catch (e) {
            console.error(e);
        }
    };
    createChat = async (title: string) => {
        try {
            await api.createChat({ title });
            // await this.setChatsList();
        } catch (e) {
            console.error(e);
        }
    };
}
