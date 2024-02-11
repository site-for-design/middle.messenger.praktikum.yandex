import express from "express";
// import ViteExpress from "vite-express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 3000;
// ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
app.listen(PORT, function (err) {
 if (err) console.log("Error in server setup");
 console.log("Server listening on Port", PORT);
});

app.use("/assets", express.static(__dirname + "/dist/assets"));
app.use("/img", express.static(__dirname + "/dist/img"));
app.use("/scss", express.static(__dirname + "/dist/scss"));

app.get("*", function (req, res) {
 res.sendFile("dist/index.html", { root: __dirname });
});
