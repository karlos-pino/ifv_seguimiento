# Portal estudiantes

Sitio estático para consultar informes estudiantiles construidos desde Markdown.

## Estructura

- `index.html`: interfaz principal.
- `styles.css`: estilos y comportamiento responsive.
- `app.js`: carga del JSON y render de componentes.
- `data/reports.json`: dataset estructurado derivado del Markdown fuente.
- `scripts/build-data.ps1`: generador del dataset a partir de `Informes Estudiantiles`.

## Regenerar datos

```powershell
powershell -ExecutionPolicy Bypass -File ".\\Portal estudiantes\\scripts\\build-data.ps1"
```
