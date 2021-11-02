const { stdout } = process;
const fs = require("fs");
const path = require("path");

const pathFile = path.join(__dirname, "text.txt");
let read = fs.createReadStream(pathFile);
read.on("data", (data) => stdout.write(data));
