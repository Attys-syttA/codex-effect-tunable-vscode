# Codex Effect Tunable

Local VS Code theme extension based on the original
[Codex Effect](https://github.com/Steamforge/codex-effect-vscode) theme by Steamforge.

This fork keeps the dark sci-fi look, but exposes multiple tone variants as separate
themes:

- Codex Effect Tunable Cyan
- Codex Effect Tunable Blue
- Codex Effect Tunable Green
- Codex Effect Tunable Amber
- Codex Effect Tunable Rose

## Development

Install dependencies:

```powershell
npm install
```

Package a VSIX:

```powershell
npx vsce package
```

Install the generated VSIX from VS Code:

```powershell
code --install-extension .\codex-effect-tunable-0.1.0.vsix
```

## Upstream

The original repository is kept as the `upstream` remote for reference. This local
version is renamed so it can be installed beside the original theme without replacing it.
