import { JSDOM } from "jsdom";

const jsdom = new JSDOM("<body></body>", {
    url: "https://example.org",
});

global.window = jsdom.window;
global.document = jsdom.document;
global.FormData = jsdom.window.FormData;
// (global.HTTPTransport as typeof HTTPTransport) = HTTPTransport;
