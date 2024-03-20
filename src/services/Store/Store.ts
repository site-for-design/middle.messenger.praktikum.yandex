import { Chat } from "../../api/chats";
import { Message, User } from "../../api/types";
import merge from "../../helpers/merge";
import EventBus from "../EventBus";

export type StoreState = {
    user: User | null;
    currentChat: Chat | null;
    currentChatUsers: User[];
    currentChatMessages: Message[];
    chatList: Chat[];
};

export const EVENT_UPDATE = "1";
const STORE_NAME = "messenger";
const INIT_STATE: StoreState = {
    user: null,
    currentChat: null,
    currentChatUsers: [],
    currentChatMessages: [],
    chatList: [],
};

class Store extends EventBus {
    static _instance: Store;

    private _state: StoreState = {
        user: null,
        currentChat: null,
        currentChatUsers: [],
        currentChatMessages: [],
        chatList: [],
    };
    constructor() {
        if (Store._instance) {
            return Store._instance;
        }
        super();

        Store._instance = this;

        const savedState = localStorage.getItem(STORE_NAME);

        this._state = merge(
            this._state,
            savedState ? JSON.parse(savedState ?? "") ?? {} : {}
        );

        this.on(EVENT_UPDATE, () => {
            localStorage.setItem(STORE_NAME, JSON.stringify(this._state));
        });
    }

    getState(): StoreState {
        return this._state;
    }
    getStateEl<T extends keyof StoreState>(key: T): StoreState[T] {
        return this._state ? this._state[key] : this._state;
    }
    removeState() {
        this._state = INIT_STATE;
        console.log(this._state);

        this.emit(EVENT_UPDATE);
        console.log(this._state);
    }
    set<T extends keyof StoreState>(key: T, value: StoreState[T]) {
        this._state[key] = value;
        this.emit(EVENT_UPDATE);
        return this;
    }
}
export const store = new Store();
