import fetch from "./HTTPTransportYaPraktikum";

export const uploadFile = async (data: FormData): Promise<unknown> => {
    return fetch.post(`/resources`, { data });
};

export const addChatUsers = async (path: string): Promise<unknown> => {
    return fetch.get(`/resources${path}`);
};
