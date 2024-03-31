import { expect } from "chai";
import Block, {
  BlockProps,
  setDefaultClassName,
} from "../src/services/Block.ts";

class TestBlock extends Block {
  constructor(props: BlockProps) {
    super(setDefaultClassName(props, "test"));
  }
  render() {
    return this.compile("{{text}}", this.props);
  }
}

describe("Block component", function () {
  it("Check instantance of", () => {
    const testBlock = new TestBlock({ text: "2" });
    expect(testBlock).to.instanceOf(Block);
  });
  it("Is setProps work", () => {
    const testBlock = new TestBlock({ text: "2" });
    testBlock.setProps({ text: "22" });
    expect(testBlock.props.text).to.equal("22");
  });
  it("Is text set into tag", () => {
    const testBlock = new TestBlock({ text: "2" });
    testBlock.setProps({ text: "22" });
    expect(testBlock.element.innerHTML).to.equal("22");
  });
  it("Check tagname", () => {
    const testBlock = new TestBlock({ test: "2" });
    expect(testBlock.element.tagName).to.equal("DIV");
  });
  it("Check classnames", () => {
    const testBlock = new TestBlock({
      text: "2",
      attrs: { class: "test-2" },
    });
    expect(testBlock.element.classList.length).to.equal(2);
  });
});
