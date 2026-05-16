const fs = require("fs");
const path = require("path");
const { TextDecoder } = require("util");

const root = path.resolve(__dirname, "..");
const decoder = new TextDecoder("utf-8", { fatal: true });
const ignoredDirectories = new Set([".git", "node_modules", ".vscode"]);
const textExtensions = new Set([
  ".js",
  ".json",
  ".md",
  ".yml",
  ".yaml",
  ".txt",
  ".gitignore",
  ".vscodeignore"
]);

function isTextFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return textExtensions.has(extension) || textExtensions.has(path.basename(filePath));
}

function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        walk(path.join(directory, entry.name), files);
      }
      continue;
    }

    if (entry.isFile()) {
      const filePath = path.join(directory, entry.name);
      if (isTextFile(filePath)) {
        files.push(filePath);
      }
    }
  }
  return files;
}

const failures = [];

for (const filePath of walk(root)) {
  const data = fs.readFileSync(filePath);
  try {
    decoder.decode(data);
  } catch (error) {
    failures.push(`${path.relative(root, filePath)} is not valid UTF-8.`);
    continue;
  }

  if (data.length >= 3 && data[0] === 0xef && data[1] === 0xbb && data[2] === 0xbf) {
    failures.push(`${path.relative(root, filePath)} starts with a UTF-8 BOM.`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Encoding check passed.");
