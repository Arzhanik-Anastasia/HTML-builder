const { stdout } = process;
const { fs, createWriteStream } = require("fs");
const path = require("path");
const readline = require("readline");

stdout.write("Введите, ваш текст\n");

const stream = createWriteStream(path.join(__dirname, "text.txt"));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (line) => {
  if (line == "exit") {
    stdout.write("Пока");
    process.exit();
  } else {
    stream.write(`${line}\n`);
  }
});

process.on("beforeExit", () => stdout.write("Пока"));
