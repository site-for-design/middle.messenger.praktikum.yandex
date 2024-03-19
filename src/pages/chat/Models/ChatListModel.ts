import * as api from "../../../api/chats";
import Block from "../../../services/Block";
import { Store, setChatList } from "../../../services/Store";

const store = new Store();

export default class ChatListModel {
    // view: Block;
    // constructor(view: Block) {
    //     this.view = view;
    // }
    constructor() {}
    setChatsList = async () => {
        const chats = await api.getChats();
        setChatList(chats);
    };
    deleteChat = async () => {
        try {
            await api.deleteChat();
            await this.setChatsList();
        } catch (e) {
            console.error(e);
        }
    };
    createChat = async (title: string) => {
        try {
            await api.createChat({ title });
            await this.setChatsList();
        } catch (e) {
            console.error(e);
        }
    };
}
