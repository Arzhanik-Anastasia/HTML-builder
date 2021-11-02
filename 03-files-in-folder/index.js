const { readdir } = require("fs").promises;
const path = require("path");
const { stat } = require("fs");

let url = path.join(__dirname, `secret-folder`);
(async function getInfo() {
  try {
    const files = await readdir(url, {
      withFileTypes: true,
    });
    console.log(files);
    for (const file of files)
      if (file.isFile()) {
        url = path.join(__dirname, `secret-folder/${file.name}`); //строка
        console.log(file.name);

        const obj = path.parse(url); //обьект
        await stat(url, async (err, stats) => {
          console.log(
            `${obj.name} - ${obj.ext.slice(1)} - ${Math.round(
              stats.size / 1024
            )}kb`
          );
        });
      }
  } catch (err) {
    console.error(err);
  }
})();
