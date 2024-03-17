import { User } from "../../api/types";
import Store from "./Store";

const store = new Store();

export const setCurrentUser = (user: User) => {
    store.set("user", user);
};

export const setCurrentChatId = (id: number) => {
    store.set("currentChatId", id);
};
