const { readdir } = require("fs").promises;
const path = require("path");
const { stat } = require("fs");

let url = path.join(__dirname, `secret-folder`);
(async function getInfo() {
  try {
    const files = await readdir(url, {
      withFileTypes: true,
    });
    for (const file of files)
      if (file.isFile()) {
        url = path.join(__dirname, `secret-folder/${file.name}`);
        const obj = path.parse(url);
        console.log(url);
        await stat(url, async (err, stats) => {
          console.log(
            `${obj.name} - ${obj.ext.slice(1)} - ${stats.size / 1024} kb`
          );
        });
      }
  } catch (err) {
    console.error(err);
  }
})();
