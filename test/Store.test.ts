import { expect, use } from "chai";
import Block, {
  BlockProps,
  setDefaultClassName,
} from "../src/services/Block.ts";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { INIT_STATE, Store } from "../src/services/Store/Store.ts";
import { Connect } from "../src/services/Store/Connect.ts";
import { User } from "../src/api/types.ts";

const mockUser: User = {
  id: 1,
  first_name: "user",
  second_name: "user",
  display_name: "user",
  login: "user",
  email: "user",
  phone: "user",
  avatar: "user",
};

class TestBlock extends Block {
  constructor(props: BlockProps) {
    super(setDefaultClassName(props, "test"));
  }
  render() {
    return this.compile("{{text}}", this.props);
  }
}
const TestBlockWithStore = Connect(TestBlock, (state) => {
  return state;
});

describe("Store", () => {
  use(sinonChai);
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it("should init store with initial object", () => {
    const store = new Store();
    expect(store.getState()).deep.equals(INIT_STATE);
  });
  it("should be equial updated user", () => {
    const store = new Store();
    store.set("user", mockUser);
    expect(store.getStateEl("user")).deep.equals(mockUser);
  });
  describe("Component binding", () => {
    let store: Store;
    let component: Block;
    let setProps: ReturnType<typeof sandbox.spy>;

    beforeEach(() => {
      store = new Store();
      component = new TestBlockWithStore({ text: "2" });
      setProps = sandbox.spy(component, "setProps");
    });
    it("should not update component when component did mount", () => {
      component.render();
      expect(setProps).to.not.be.called;
    });
    it("should update component when Store get updated", () => {
      component.render();
      store.set("user", mockUser);
      expect(setProps).to.be.calledOnce;
    });
  });
});
