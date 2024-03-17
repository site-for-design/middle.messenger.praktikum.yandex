import HTTPTransport from "../utils/HTTPTransport";

const BASE_URL = "https://ya-praktikum.tech/api/v2";
export const RESOURCES_URL = BASE_URL + "/resources";

const fetch = new HTTPTransport(BASE_URL);
export default fetch;
