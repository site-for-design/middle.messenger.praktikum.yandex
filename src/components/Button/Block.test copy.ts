// var module = require("./testedServer");
// var assert = require("assert");

// var chai = require("chai"),
//     chaiHttp = require("chai-http");

// chai.use(chaiHttp);

// describe("Check receiving data from server:", function () {
//     beforeEach(function () {
//         module.server.listen(9099);
//     });

//     it("Should receive a non-null object containing the chat logs", function (done) {
//         chai.request("http://localhost:3000")
//             .post("/")
//             .send("poll0,0/Annonymous.")
//             .end(function (res) {
//                 console.log(res);
//                 assert.equal(
//                     res != null,
//                     true,
//                     "Error: test has failed - server response is null"
//                 );
//                 done();
//             });
//     });

//     afterEach(function () {
//         // runs after each test in this block

//         module.server.close();
//     });
// });
