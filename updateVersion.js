const fs = require("fs");
const fileName = "./package.json";
const file = require(fileName);

const versionParts = file.version.split(".").map(Number);
versionParts[2]++;
file.version = versionParts.join(".");

fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
  if (err) return console.log(err);
  console.log("✅ version updated to", file.version);
});
