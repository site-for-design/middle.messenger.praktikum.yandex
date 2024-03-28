import { expect } from "chai";
import Block from "../../services/Block";
import Button from "./index";
console.log(Button);

describe("Button component", function () {
    it("Check 1", () => {
        expect(1).to.equal(1);
    });
    it("Check instantance of", () => {
        const button = new Button({ text: "2" });
        expect(button).to.instanceOf(Block);
    });
    it("Is setProps work", () => {
        const button = new Button({ text: "2" });
        button.setProps({ text: "22" });
        expect(button.props.text).to.equal("22");
    });
    it("Is setProps work2", () => {
        const button = new Button({ text: "2" });
        button.setProps({ text: "22" });
        expect(button.props.text).to.equal("22");
    });
});
