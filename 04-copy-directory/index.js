const path = require("path");
const fsPromises = require("fs").promises;

const urlCopy = path.join(__dirname, "files");
const urlCopied = path.join(__dirname, "files-copy");

async function copyFile(urlCopy, urlCopied) {
  try {
    fsPromises.mkdir(urlCopied, { recursive: true });
    const files = await fsPromises.readdir(urlCopy, {
      withFileTypes: true,
    });
    for (const file of files) {
      const filePath = path.join(urlCopy, file.name);
      const copyPath = path.join(urlCopied, file.name);
      fsPromises.copyFile(filePath, copyPath);
    }
  } catch (err) {
    console.error(err);
  }
}
copyFile(urlCopy, urlCopied);

/* module.exports = copyFile; */
