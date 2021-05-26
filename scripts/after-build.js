const fs = require("fs-extra");
const path = require("path");
const glob = require("glob").sync;

// let files = glob("*.vsix", { cwd: path.resolve(__dirname, "../"), absolute: true });
// files.forEach((filepath) => {
//     let targetpath = path.resolve(__dirname, "../docs/releases", path.basename(filepath));
//     fs.renameSync(filepath, targetpath);
// })
fs.copySync(
    path.resolve(__dirname, "../src/built-in-voice-packages"),
    path.resolve(__dirname, "../dist/built-in-voice-packages")
)