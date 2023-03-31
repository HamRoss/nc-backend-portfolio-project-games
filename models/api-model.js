const fs = require("fs/promises");

function fetchEndpoints() {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((data) => {
      const parsedData = JSON.parse(data);
      return parsedData;
    })
    .catch((error) => {
      console.log("error reading file: ", error);
    });
}

module.exports = { fetchEndpoints };
