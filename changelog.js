const fs = require("fs");
const path = require("path");
const readline = require("readline");
const os = require("os");

const isExists = async (filePath) => {
  return await fs.promises
    .access(filePath)
    .then(() => true)
    .catch(() => false);
};
// const __dirname = path.resolve();
const filePath = path.resolve(__dirname, "CHANGELOG.md");

// let projectName = "";

const args = process.argv.slice(2);
args.forEach(async (projectName) => {
  const outputFilePath = path.resolve(__dirname, "packages", projectName);
  if (!(await isExists(outputFilePath))) {
    console.log("项目不存在, 请重新输入：", projectName);
  } else {
    const readLine = readline.createInterface({
      input: fs.createReadStream(filePath),
    });

    const outputFileName = path.resolve(outputFilePath, "CHANGELOG.MD");
    const writeStream = fs.createWriteStream(outputFileName);

    readLine.on("line", (line) => {
      line = line.trim();
      // 去除issue
      line = line.replace(/\(\[.*?\]\(.*?\)\)$/, "");
      if (line.match(/^\*\s\*\*.*?:\*\*/)) {
        // 包含对应的项目
        if (line.includes(`**${projectName}:**`)) {
          writeStream.write(line + os.EOL);
        }
      } else if (line.match(/^\*\s/)) {
        if (line.includes(`* ${projectName}`)) {
          writeStream.write(line + os.EOL);
        }
      } else {
        writeStream.write(line + os.EOL);
      }
    });
  }
});
// const input = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   prompt: "请选择需要生成changelog的项目: "
// })
//
// input.prompt();
//
// input.on('line', async (answer) => {
//   projectName = answer;
//   const outputFilePath = path.resolve(__dirname, 'packages', projectName);
//   if(!await isExists(outputFilePath)) {
//     input.setPrompt('项目不存在, 请重新输入：');
//     input.prompt();
//   }else {
//     input.close();
//     const readLine = readline.createInterface({
//       input: fs.createReadStream(filePath)
//     });
//
//     const outputFileName = path.resolve(outputFilePath, 'CHANGELOG.MD');
//     const writeStream = fs.createWriteStream(outputFileName)
//
//     readLine.on('line', (line) => {
//       line = line.trim();
//       if(line.match(/^\*\s\*\*.*?:\*\*/)) { // 包含对应的项目
//         console.log('符合', line);
//         if(line.includes(`**${projectName}:**`)) {
//           console.log('再符合', projectName);
//           writeStream.write(line + os.EOL);
//         }
//       }else {
//         console.log('不符合', line)
//         writeStream.write(line + os.EOL);
//       }
//     });
//   }
// })
//
//
