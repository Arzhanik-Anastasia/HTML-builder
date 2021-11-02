const { stdout } = process;
const fs = require("fs");
const path = require("path");
const readline = require("readline");

stdout.write("Введите, ваш текст\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (line) => {
  if (line == "exit") {
    stdout.write("Пока");
    process.exit();
  }
  writeToFile(line);
});

function writeToFile(text) {
  fs.appendFile(path.join(__dirname, "text.txt"), `${text}\n`, (err) => {
    if (err) throw err;
  });
}
process.on("beforeExit", () => stdout.write("Пока"));
