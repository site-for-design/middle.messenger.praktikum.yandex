import { getChatToken } from "./chats";
import { uploadFile } from "./resources";

type Message = {
    chat_id: number;
    content: string;
    file: string | null;
    id: number;
    is_read: true;
    time: string;
    type: string;
    user_id: number;
};

class ChatWS {
    static _instance: InstanceType<typeof ChatWS>;
    socket: WebSocket;
    messages: Message[];
    constructor() {
        if (ChatWS._instance) {
            return ChatWS._instance;
        }
        ChatWS._instance = this;

        this.socket;
        this.messages = [];
    }

    async connect(userId: number, chatId: number) {
        this.messages = [];

        try {
            const token = await getChatToken(chatId);

            if (token) {
                this.socket = new WebSocket(
                    `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`
                );
                this._addEvents();
            }
        } catch (e) {
            console.error(e);
        }
    }

    private _addEvents() {
        this.socket?.addEventListener("open", this._onOpen);

        this.socket?.addEventListener("close", this._onClose);

        // this.socket?.addEventListener("error", this._onError);
    }

    private _onOpen = () => {
        console.log("Соединение установлено");
        this.getOldMessages();
    };
    private _onClose(event: CloseEvent) {
        if (event.wasClean) {
            console.log("Соединение закрыто чисто");
        } else {
            console.log("Обрыв соединения");
        }

        console.log(`Код: ${event.code} | Причина: ${event.reason}`);
    }
    // private _onError(event: Event) {
    //     console.log("Ошибка", event?.message);
    // }

    getOldMessages() {
        console.log(this);

        this.socket.send(
            JSON.stringify({
                content: this.messages.length,
                type: "get old",
            })
        );
    }

    onMessage() {}

    sendMessage(message: string) {
        this.socket?.send(
            JSON.stringify({
                content: message,
                type: "message",
            })
        );
    }

    sendFile = async (formData: FormData) => {
        const file = await uploadFile(formData);
        console.log(file);
    };
}

export default ChatWS;
