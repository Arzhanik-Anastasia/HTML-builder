const path = require("path");
const fs = require("fs");

const pathBundle = path.join(__dirname, "project-dist", "bundle.css");

async function createBundle(pathBundle) {
  let urlCss = path.join(__dirname, "styles");
  const files = await fs.promises.readdir(urlCss, {
    withFileTypes: true,
  });
  let arrFilesCss = [];
  for (const file of files) {
    urlCss = path.join(__dirname, "styles", `${file.name}`);
    const obj = path.parse(urlCss);
    if (file.isFile() && obj.ext == ".css") {
      arrFilesCss.push(obj.base);
    }
  }
  const fileWriteStream = fs.createWriteStream(pathBundle);
  streamMergeRecursive(arrFilesCss, fileWriteStream);
}
function streamMergeRecursive(arrFilesCss = [], fileWriteStream) {
  if (!arrFilesCss.length) {
    return fileWriteStream.end();
  }
  console.log(arrFilesCss);
  const currentFile = path.resolve(__dirname, "styles", arrFilesCss.shift());
  const currentReadStream = fs.createReadStream(currentFile);
  currentReadStream.pipe(fileWriteStream, { end: false });
  currentReadStream.on("end", function () {
    streamMergeRecursive(arrFilesCss, fileWriteStream);
  });
  currentReadStream.on("error", function (err) {
    console.error(err);
    fileWriteStream.close();
  });
}
createBundle(pathBundle);

module.exports = { createBundle };
