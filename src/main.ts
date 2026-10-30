//Get all the HTML elements
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;

const undoButton = document.querySelector<HTMLButtonElement>("#undo")!;
const redoButton = document.querySelector<HTMLButtonElement>("#redo")!;
const clearButton = document.querySelector<HTMLButtonElement>("#clear")!;
const status = document.querySelector<HTMLElement>("#status")!;

//Get the customization controls, check html for ids
const opacitySlider = document.querySelector<HTMLInputElement>("#opacity")!;
const sizeSlider = document.querySelector<HTMLInputElement>("#size")!;
const colorSelect = document.querySelector<HTMLSelectElement>("#color")!;

const opacityValue = document.querySelector<HTMLElement>("#opacityValue")!;
const sizeValue = document.querySelector<HTMLElement>("#sizeValue")!;

//Store x and y coordinates
type Point = { x: number; y: number };

//Each line now stores its own drawing settings
//since line is just many points, we store a list of points to form lines
type Line = {
  points: Point[];
  color: string;
  opacity: number;
  size: number;
};

//Store drawing history, lines are the basis for a collection of lines
let lines: Line[] = [];
let redoLines: Line[] = [];
let currentLine: Line | null = null;
let drawing = false;

function getPoint(event: PointerEvent): Point {
  const rect = canvas.getBoundingClientRect();

  //.client reads the value of the client window viewport, minus that to left/top to retrieve the number,
  //and scale it up to canvas width/height
  return {
    x: (event.clientX - rect.left) * canvas.width / rect.width,
    y: (event.clientY - rect.top) * canvas.height / rect.height,
  };
}

// Draw one individual line
function drawLine(line: Line): void {
  if (line.points.length === 0) return;
  //beginPath() is used to start a new drawing path by emptying the current list of subpaths
  ctx.beginPath();
  //move the starting point of that subpath to x and y
  ctx.moveTo(line.points[0].x, line.points[0].y);

  for (let i = 1; i < line.points.length; i++) {
    ctx.lineTo(line.points[i].x, line.points[i].y);
  }
  // Make a single click produce a dot
  if (line.points.length === 1) {
    ctx.lineTo(
      line.points[0].x + 0.1,
      line.points[0].y + 0.1,
    );
  }

  ctx.strokeStyle = line.color;
  ctx.globalAlpha = line.opacity / 100;
  ctx.lineWidth = line.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.stroke();

  //Reset opacity so it doesn't affect other canvas operations
  ctx.globalAlpha = 1;
}

// Make everything black agian
function redraw(): void {
  ctx.globalAlpha = 1;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //Redraw all completed lines
  for (const line of lines) {
    drawLine(line);
  }

  if (currentLine) {
    drawLine(currentLine);
  }

  undoButton.disabled = lines.length === 0;
  redoButton.disabled = redoLines.length === 0;

  status.textContent = `${lines.length} line(s) drawn`;
}

//Update slider labels
opacitySlider.addEventListener("input", () => {
  opacityValue.textContent = `${opacitySlider.value}%`;
});

sizeSlider.addEventListener("input", () => {
  sizeValue.textContent = `${sizeSlider.value} px`;
});

canvas.addEventListener("pointerdown", (event) => {
  drawing = true;
  canvas.setPointerCapture(event.pointerId);

  currentLine = {
    points: [getPoint(event)],
    color: colorSelect.value,
    opacity: Number(opacitySlider.value),
    size: Number(sizeSlider.value),
  };

  redraw();
});

canvas.addEventListener("pointermove", (event) => {
  if (!drawing || !currentLine) return;

  currentLine.points.push(getPoint(event));
  redraw();
});

function finishDrawing(): void {
  if (!drawing || !currentLine) return;

  drawing = false;

  lines.push(currentLine);
  currentLine = null;

  redoLines = [];

  redraw();
}

canvas.addEventListener("pointerup", finishDrawing);
canvas.addEventListener("pointercancel", finishDrawing);

undoButton.addEventListener("click", () => {
  const line = lines.pop();

  if (line) {
    redoLines.push(line);
  }

  redraw();
});

redoButton.addEventListener("click", () => {
  const line = redoLines.pop();

  if (line) {
    lines.push(line);
  }

  redraw();
});

clearButton.addEventListener("click", () => {
  lines = [];
  redoLines = [];
  currentLine = null;
  drawing = false;

  redraw();
});

redraw();
