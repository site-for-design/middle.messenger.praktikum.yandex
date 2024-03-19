import fetch from "./HTTPTransportYaPraktikum";
import { User } from "./types";

// type UnknownData = Record<string, unknown>;

type Message = {
    user: User;
    time: string;
    content: string;
};

export type Chat = {
    id: number;
    title: string;
    avatar: string;
    unread_count: number;
    created_by: number;
    last_message: Message | null;
};

type CreateChatResponse = Chat[];

declare module CreateChat {
    export type Request = {
        title: string;
    };
    export type Response = {
        title: string;
    };
}

declare module DeleteChat {
    export type Request = {
        chatId: number;
    };
    export type Response = {
        userId: number;
        result: {
            id: number;
            title: string;
            avatar: string;
            created_by: number;
        };
    };
}

export const getChats = async (): Promise<CreateChatResponse> => {
    return fetch.get("/chats");
};

export const getChat = async (chatId: string): Promise<CreateChatResponse> => {
    return fetch.get(`/chats/${chatId}/common`);
};

export const createChat = async (
    data: CreateChat.Request
): Promise<CreateChat.Response> => {
    return fetch.post("/chats", { data });
};

export const deleteChat = async (
    data: DeleteChat.Request
): Promise<DeleteChat.Response> => {
    return fetch.delete("/chats", { data });
};

export const getChatFiles = async (
    chatId: string
): Promise<CreateChatResponse> => {
    return fetch.get(`/chats/${chatId}/files`);
};

export const getChatUsers = async (chatId: number): Promise<User[]> => {
    return fetch.get(`/chats/${chatId}/users`);
};

export const getChatMessagesCount = async (
    chatId: string
): Promise<CreateChatResponse> => {
    return fetch.get(`/chats/new/${chatId}/users`);
};
export const changeChatAvatar = async (
    data: FormData
): Promise<CreateChatResponse> => {
    return fetch.put(`/chats/avatar`, { data });
};

declare module AddChatUsers {
    export type Request = {
        users: number[];
        chatId: number;
    };
    export type Response = Chat[];
}
export const addChatUsers = async (
    data: AddChatUsers.Request
): Promise<AddChatUsers.Response> => {
    return fetch.put(`/chats/users`, { data });
};

export const deleteChatUsers = async (
    data: AddChatUsers.Request
): Promise<unknown> => {
    return fetch.delete(`/chats/users`, { data });
};

type GetChatTokenResponse = {
    token: string;
};

export const getChatToken = async (chatId: number): Promise<string | null> => {
    try {
        const token: GetChatTokenResponse = await fetch.post(
            `/chats/token/${chatId}`
        );
        return token.token;
    } catch (e) {
        return null;
    }
};
