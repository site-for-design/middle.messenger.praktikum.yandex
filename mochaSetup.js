import { JSDOM } from "jsdom";

const dom = new JSDOM(
  "<!DOCTYPE html><html><head></head><body id='app'></body></html>",
  {
    url: "http://localhost",
  },
);

global.window = dom.window;
global.document = dom.window.document;
// (global.HTTPTransport as typeof HTTPTransport) = HTTPTransport;
