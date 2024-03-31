import { expect } from "chai";
import Block from "../src/services/Block.ts";
import { Router } from "../src/services/Router/Router.ts";

class Page extends Block {
  constructor() {
    super();
  }
  render() {
    return this.compile("{{text}}", this.props);
  }
}

describe("Проверяем переходы у Роута", () => {
  let router: Router;
  beforeEach(() => {
    router = new Router("#app");
    router
      .use("*", Page)
      .use("/", Page)
      .use("/sign-up", Page)
      .use("/messenger", Page)
      .use("/settings", Page)
      .use("/error500", Page)
      .start();
    router.go("/");
  });
  it("Check router .back and .forward work", () => {
    expect(router._currentRoute?._pathname).to.eq("/");
    router.go("/sign-up");
    router.back();
    router.forward();
    expect(router._currentRoute?._pathname).to.eq("/sign-up");
  });
  it("Check router.go work", () => {
    router.go("/sign-up");
    router.go("/messenger");
    router.go("/settings");
    expect(router._currentRoute?._pathname).to.eq("/settings");
  });
});
