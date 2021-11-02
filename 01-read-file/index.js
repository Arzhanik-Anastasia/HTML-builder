const { stdout } = process;
const fs = require("fs");
const path = require("path");

let read = fs.createReadStream(path.join(__dirname, "text.txt"));
read.on("data", (data) => stdout.write(data));
