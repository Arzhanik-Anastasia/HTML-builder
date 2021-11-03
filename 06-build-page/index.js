const path = require("path");
const fs = require("fs");
const { readdir } = require("fs").promises;

const url = path.join(__dirname, "project-dist");
const pathCss = path.join(__dirname, "project-dist", "style.css");

fs.promises.mkdir(url, { recursive: true });
async function createHtml() {
  const componentUrl = path.join(__dirname, "components");
  const readableStream = fs.createReadStream(
    path.join(__dirname, "template.html"),
    "utf-8"
  );
  const files = await readdir(componentUrl, {
    withFileTypes: true,
  });

  /*   const article = await fs.promises.readFile(
    path.join(componentUrl, "articles.html")
  );
  const footer = await fs.promises.readFile(
    path.join(componentUrl, "footer.html")
  );
  */
  for (const file of files) {
    let urlFile = path.join(__dirname, `secret-folder/${file.name}`);
    const obj = path.parse(urlFile);
    const fileText = await fs.promises.readFile(
      path.join(componentUrl, file.name)
    );
    let tag = fileText.toString();
    let text = "";
    readableStream.on("data", (data) => {
      data = data.toString();
      /*   console.log(data.indexOf(`{{obj.name}}`)); */
    });
  }

  readableStream.on("end", async () => {
    await fs.promises.writeFile(
      path.join(__dirname, "project-dist", "index.html"),
      text,
      "utf8"
    );
  });
}

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
createHtml();
copyFile(urlCopy, urlCopied);
