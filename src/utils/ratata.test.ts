import sinon from "sinon";
import { expect } from "chai";

const sandbox = sinon.createSandbox();
const myAPI: any = { hello: function () {} };

describe("myAPI.hello method", function () {
    beforeEach(function () {
        // stub out the `hello` method
        sandbox.stub(myAPI, "hello");
    });

    afterEach(function () {
        // completely restore all fakes created through the sandbox
        sandbox.restore();
    });
    it("checkTest", () => {
        let a = [1, 2];
        let b = a;
        expect(a)
            .to.be.an("array")
            .that.equal(b)
            .and.does.not.deep.equal([1, 2, 3]);
        expect({ a: 1, b: 2 }).to.not.have.any.keys("c", "d");

        expect(2).to.be.at.least(1);
        expect(1).to.be.below(2);
        // assert.expect("foo").to.equal("foo").and.not.be.undefined; // passes
        // expect("foo").to.not.be.undefined.and.equal("foo"); // fails
    });

    it("should be called twice", function () {
        myAPI.hello();
        myAPI.hello();
        sandbox.assert.calledTwice(myAPI.hello);
    });
});

// "test": "cross-env TS_NODE_PROJECT=\"tsconfig.json\" mocha -r ts-node/register src/**/*.test.ts",
