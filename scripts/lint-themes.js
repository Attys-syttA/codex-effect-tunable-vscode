const fs = require("fs");
const path = require("path");
const { parseJsonc } = require("./jsonc");

const root = path.resolve(__dirname, "..");
const packagePath = path.join(root, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const themes = packageJson.contributes && packageJson.contributes.themes;

if (!Array.isArray(themes) || themes.length === 0) {
  throw new Error("package.json must contribute at least one theme.");
}

const labels = new Set();
const themeNames = new Set();
const colorPattern = /^#[0-9a-fA-F]{3,8}$/;

for (const theme of themes) {
  if (!theme.label || labels.has(theme.label)) {
    throw new Error(`Theme label must be present and unique: ${theme.label}`);
  }
  labels.add(theme.label);

  if (theme.uiTheme !== "vs-dark") {
    throw new Error(`${theme.label}: expected uiTheme to be vs-dark.`);
  }

  if (!theme.path) {
    throw new Error(`${theme.label}: missing theme path.`);
  }

  const themePath = path.join(root, theme.path);
  if (!fs.existsSync(themePath)) {
    throw new Error(`${theme.label}: theme file does not exist: ${theme.path}`);
  }

  const raw = fs.readFileSync(themePath, "utf8");
  const parsed = parseJsonc(raw, theme.path);

  if (parsed.name !== theme.label) {
    throw new Error(`${theme.path}: name must match package label "${theme.label}".`);
  }

  if (themeNames.has(parsed.name)) {
    throw new Error(`${theme.path}: duplicate theme name "${parsed.name}".`);
  }
  themeNames.add(parsed.name);

  if (parsed.type !== "dark") {
    throw new Error(`${theme.path}: expected type to be dark.`);
  }

  if (!parsed.colors || typeof parsed.colors !== "object") {
    throw new Error(`${theme.path}: missing colors object.`);
  }

  for (const [key, value] of Object.entries(parsed.colors)) {
    if (typeof value !== "string" || !colorPattern.test(value)) {
      throw new Error(`${theme.path}: invalid color for ${key}: ${value}`);
    }
  }

  if (!Array.isArray(parsed.tokenColors)) {
    throw new Error(`${theme.path}: missing tokenColors array.`);
  }
}

console.log(`Theme lint passed for ${themes.length} variants.`);
