import { User } from "../../api/types";
import EventBus from "../EventBus";

export type StoreState = {
    user: User | null;
    currentChatId: number | null;
};

export default class Store extends EventBus {
    static EVENT_UPDATE = "1";
    static _instance: Store;
    static STORE_NAME: "messenger";

    private _state: StoreState = { user: null, currentChatId: null };
    constructor() {
        if (Store._instance) {
            return Store._instance;
        }

        super();

        const savedState = localStorage.getItem(Store.STORE_NAME);

        this._state = savedState ? JSON.parse(savedState) ?? {} : {};

        const currentChatId = new URLSearchParams(window.location.search).get(
            "chatId"
        );
        this._state = {
            ...this._state,
            currentChatId: currentChatId ? Number(currentChatId) : null,
        };

        Store._instance = this;

        this.on(Store.EVENT_UPDATE, () => {
            localStorage.setItem(Store.STORE_NAME, JSON.stringify(this._state));
        });
    }

    getState(): StoreState {
        return this._state;
    }
    getStateEl<T extends keyof StoreState>(key: T): StoreState[T] {
        return this._state ? this._state[key] : this._state;
    }
    removeState() {
        this._state = {} as StoreState;
        this.emit(Store.EVENT_UPDATE);
    }
    set<T extends keyof StoreState>(key: T, value: StoreState[T]) {
        this._state[key] = value;
        this.emit(Store.EVENT_UPDATE);
        return this;
    }
}
