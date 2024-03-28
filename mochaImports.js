// import { register } from "node:module";
// import { pathToFileURL } from "node:url";
// register("ts-node/esm", pathToFileURL("./"));

// // register("node-esm-loader", pathToFileURL("./"));

import { register } from "node:module";
import { pathToFileURL } from "node:url";

console.log(3);

register("ts-node/esm", pathToFileURL("./"));

register("esmock", pathToFileURL("./"));
register("node-esm-loader", pathToFileURL("./"));
