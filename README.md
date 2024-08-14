# Region Marker

Region Marker is an extension that enhances the visibility of #region and #endregion comments in code.

## Features

- Colorizes #region and #endregion comments
- Supports both light and dark themes
- Customizable colors
- Option to apply background color to the whole line or just the symbol
- Bold toggle

## Extension Settings

Available settings:

- `regionMarker.fontWeight`: Set the font weight for region markers (normal or bold)
- `regionMarker.useWholeLineForBackground`: Choose whether to apply the background color to the whole line or just the marker

To customize colors, edit workbench.colorCustomizations

Example color customization:

```json
"workbench.colorCustomizations": {
  "regionMarker.region.backgroundColor": "#ff00ff2d",
  "regionMarker.region.foregroundColor": "#ffffff",
  "regionMarker.endregion.backgroundColor": "#00ff002d",
  "regionMarker.endregion.foregroundColor": "#000000"
}
```

## Known Issues

- None

## Release Notes

### 1.0.0

Initial release

---