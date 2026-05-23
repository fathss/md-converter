# ✦ Markdown Converter

> **Write in Markdown. Export in style.**  
> A slick browser-based editor that turns your `.md` files into polished Word documents — no copy-pasting, no formatting hell, no fuss.

![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react&logoColor=white)
![Pandoc](https://img.shields.io/badge/Powered%20by-Pandoc-orange?style=flat-square)

---

## What Is This?

**Markdown Converter** bridges the gap between the clean simplicity of Markdown and the real-world requirement of `.docx` files. Load your files, edit live, watch the preview update in real time, and hit export — your Word document downloads, fully formatted, diagrams included.

No Word. No Google Docs. Just Markdown → DOCX, done right.

---

## ✦ Features

| | |
|---|---|
| ✏️ **Live browser editor** | Edit Markdown directly in the browser with a real-time split preview |
| 👁️ **Instant preview** | Rendered preview updates as you type, side-by-side with the editor |
| 📄 **DOCX export** | One-click export to a properly formatted Word document |
| 🎨 **Style templates** | Choose between `default` and `academic` document styles |
| 📑 **Table of contents** | Auto-generate a TOC at export time |
| 🔢 **Page numbers** | Toggle page numbering on or off |
| 📊 **Mermaid diagrams** | Mermaid code blocks are rendered to images and embedded in the exported doc |

---

## How It Works

```
You write Markdown  →  Browser editor + live preview
Hit Export          →  Settings sent to FastAPI backend
Backend runs Pandoc →  Mermaid blocks rendered to images first
DOCX assembled      →  File returned to browser for download
```

1. Drop your `.md` files in
2. Edit content and watch the rendered preview update live
3. Configure your export — filename, template, TOC, page numbers
4. Click export — the backend converts via Pandoc, embeds any Mermaid diagrams as images, and sends back the `.docx`

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone the repo

```bash
git clone https://github.com/fathss/md-converter.git
cd md-converter
```

### 2. Start the app

```bash
docker compose up --build
```

### 3. Open in your browser

```
http://localhost:11025
```

That's it. No environment setup, no dependency wrangling.

### Stop the app

```bash
docker compose down
```

---

## Architecture

- **Frontend** — React app with a split-pane editor/preview layout and export controls
- **Backend** — FastAPI service that orchestrates Pandoc conversion and Mermaid rendering
- **Mermaid** — Rendered via Mermaid CLI + Puppeteer inside the backend container before conversion, so diagrams appear correctly in the final document
- **No disk storage** — Generated `.docx` files are held in memory and streamed directly to the browser

---

## Export Options

| Option | Values | Description |
|---|---|---|
| `filename` | any string | Name of the downloaded `.docx` file |
| `template` | `default`, `academic` | Document style template |
| `table_of_contents` | on / off | Auto-generated TOC |
| `page_numbers` | on / off | Footer page numbering |

---

## Contributing

Issues and PRs are welcome. If something's broken or you want a feature, open an issue and let's talk about it.

---

<p align="center">
  Built with <a href="https://pandoc.org">Pandoc</a> · <a href="https://fastapi.tiangolo.com">FastAPI</a> · <a href="https://react.dev">React</a> · <a href="https://mermaid.js.org">Mermaid</a>
</p>