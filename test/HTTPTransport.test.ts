import { expect, use } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import HTTPTransport from "../src/utils/HTTPTransport.ts";

describe("HTTPTransport", function () {
  use(sinonChai);
  const sandbox = sinon.createSandbox();
  let http: HTTPTransport;
  let request: any;

  beforeEach(function () {
    http = new HTTPTransport();
    request = sandbox
      .stub(http, "request" as keyof typeof http)
      .callsFake(() => Promise.resolve("OK"));
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should stringify object with string values into query params", function () {
    http.get("", { data: { a: "a", b: "b" } });

    expect(request).calledWithMatch("?a=a&b=b", {
      data: { a: "a", b: "b" },
      method: "GET",
    });
  });
  it("should stringify object with spec symbols into query params", function () {
    http.get("", { data: { a: "a&2", b: "b" } });

    expect(request).calledWithMatch("?a=a%262&b=b", {
      data: { a: "a&2", b: "b" },
      method: "GET",
    });
  });
});
