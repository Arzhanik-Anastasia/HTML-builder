const path = require("path");
const fs = require("fs");

const url = path.join(__dirname, "project-dist");
const componentUrl = path.join(__dirname, "components");
const pathCss = path.join(__dirname, "project-dist", "style.css");
const pathHtml = path.join(__dirname, "project-dist", "index.html");
const pathTemplate = path.join(__dirname, "template.html");

fs.promises.mkdir(url, { recursive: true });

const readableStream = fs.createReadStream(pathTemplate);
const writebleStream = fs.createWriteStream(pathHtml);

readableStream.on("data", async (data) => {
  const textHtml = await replace();
  writebleStream.write(textHtml);
  async function replace() {
    let text = data.toString();
    const files = await fs.promises.readdir(componentUrl, {
      withFileTypes: true,
    });
    for (const file of files) {
      let urlFile = path.join(__dirname, `components/${file.name}`);
      const component = await fs.promises.readFile(
        path.join(componentUrl, file.name)
      );
      component.toString();
      const obj = path.parse(urlFile);
      text = text.replace(obj.name, component);
      text = text.replace("{{", "");
      text = text.replace("}}", "");
    }
    return text;
  }
});

async function createCss() {
  const pathBundle = path.join(__dirname, "project-dist", "style.css");
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

let urlCopy = path.join(__dirname, "assets");
let urlCopied = path.join(__dirname, "project-dist", "assets");

async function copyFile(urlCopy, urlCopied) {
  try {
    await fs.promises.rm(urlCopied, { recursive: true, force: true });
    fs.promises.mkdir(urlCopied, { recursive: true });
    const files = await fs.promises.readdir(urlCopy, {
      withFileTypes: true,
    });
    files.forEach((file) => {
      const pathFile = path.join(urlCopy, file.name);
      const patchCopiedFile = path.join(urlCopied, file.name);
      if (file.isDirectory()) {
        copyFile(pathFile, patchCopiedFile);
      } else {
        fs.promises.copyFile(pathFile, patchCopiedFile);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

createCss(pathCss);
copyFile(urlCopy, urlCopied);
