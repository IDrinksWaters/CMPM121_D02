//Get all the buttons and use them for later
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;
const undoButton = document.querySelector<HTMLButtonElement>("#undo")!;
const redoButton = document.querySelector<HTMLButtonElement>("#redo")!;
const clearButton = document.querySelector<HTMLButtonElement>("#clear")!;
const status = document.querySelector<HTMLElement>("#status")!;

//points is store in x and y, where an array of points form a continuous line
type Point = { x: number; y: number };
type Line = Point[];

//lines store a collection of line, and other lines also create their respective type of lines
let lines: Line[] = [];
let redoLines: Line[] = [];
let currentLine: Line | null = null;
let drawing = false;

//Figure out the coordiante of the line inside the canvas
function getPoint(event: PointerEvent): Point {
  const rect = canvas.getBoundingClientRect();

  return {
    //.client reads the value of the client window viewport, minus that to left/top to retrieve the number,
    // and scale it up to canvas width/height
    x: (event.clientX - rect.left) * canvas.width / rect.width,
    y: (event.clientY - rect.top) * canvas.height / rect.height,
  };
}

function drawLine(line: Line): void {
  if (line.length === 0) return;

  //beginPath() is used to start a new drawing path by emptying the current list of subpaths
  ctx.beginPath();
  //move the starting point of that subpath to x and y
  ctx.moveTo(line[0].x, line[0].y);
  [];
  //lineTo addes straight line to the current subpath
  for (let i = 1; i < line.length; i++) {
    ctx.lineTo(line[i].x, line[i].y);
  }

  // Make a single click produce a dot
  if (line.length === 1) {
    ctx.lineTo(line[0].x + 0.1, line[0].y + 0.1);
  }

  ctx.stroke();
}

function redraw(): void {
  // Make everything black agian
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //drawing style for the line
  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

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

canvas.addEventListener("pointerdown", (event) => {
  drawing = true;
  canvas.setPointerCapture(event.pointerId);
  currentLine = [getPoint(event)];
  redraw();
});

canvas.addEventListener("pointermove", (event) => {
  if (!drawing || !currentLine) return;

  currentLine.push(getPoint(event));
  redraw();
});

function finishDrawing(): void {
  if (!drawing || !currentLine) return;

  drawing = false;
  lines.push(currentLine);
  currentLine = null;

  //A new line clears the redo history
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
