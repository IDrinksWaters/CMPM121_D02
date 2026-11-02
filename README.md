# Simple Drawing Tool

## User Doc.

### Try the app here: https://idrinkswaters.github.io/CMPM121_D02/

### How to use the drawing tool:

1. Open the app in a browser.
2. Left click the black canvas and drag to draw a line.
3. Choose a **Line Color** from the dropdown. Ten colors are available.
4. Adjust **Line Opacity** from 0% to 100%.
5. Adjust **Line Size** from 1 px to 30 px.
6. Select **Undo** to remove the most recent completed line, or **Redo** to restore the most recently undone line.
7. Select **Clear** to erase the drawing and reset the undo/redo history.

Each complete lines keeps the color, opacity, and size that were selected when that line was started

### If to run locally:

You need a current Node.js installation with npm.
To make a production build:

```sh
npm run build
```

Vite writes the production output to `dist/`. To preview that build locally:

```sh
npm run preview
```

Note that Deno checks are not available, so the command cannot be independently confirmed from the files

## Dev Doc.

(index.html) defines the page structure, simple white page styling, toolbar buttons, brush controls, canvas, status text, and a TS entry point.
(main.ts) contains the drawing state, pointer event handling, canvas rendering, brush settings, and undo/redo/clear behavior.

The current implementation only has one drawing tool, with the ability to change opacity, size, and colors, so there's no
existing tool class hierarchy.

### Change Map: Adding a New Tool Kind

Add or extend the tool's stored data in main.ts (Lines 21–34). Include the tool type and any settings needed

Add the new tool's controls to index.html (Lines 98–141), alongside the existing opacity, size, and color settings.

Connect the new controls in main.ts (Lines 10–16) by retrieving their HTML elements.

Save the selected tool type and settings when the user starts drawing (Lines 108–119).

Add the new tool's drawing behavior to drawLine() in main.ts (Lines 47–76).

Update redraw() in main.ts (Lines 78–97) so the new tool can be displayed correctly when the canvas refreshes.

Check the pointer events, undo, redo, and clear functions in main.ts (Lines 122–172) to make sure the new tool works with the existing drawing history.

A minimal TypeScript/Vite browser project with Deno checks and GitHub Pages deployment.

## Credits

Tooling adapted from the [CMPM 121 Fall 2026 D1 starter](https://github.com/ucsc-cmpm-121-f26/d1-starter/tree/d949e744b0f9fb7c133a5316f86f2b7fe54529ad), derived from the [S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da). Those repositories have no explicit repository license; no new license is assigned to that material. The D2 scaffold was authored with OpenCode/OpenAI GPT-6.1 Sol assistance. Dependencies retain their respective licenses.
