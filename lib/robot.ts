export type Orientation = "N" | "E" | "S" | "W";
export type Command = "L" | "R" | "F";

const orientations: Orientation[] = ["N", "E", "S", "W"];
const moveDelta: Record<Orientation, [number, number]> = {
  N: [0, 1],
  E: [1, 0],
  S: [0, -1],
  W: [-1, 0],
};

export function validateFirstLine(input: string) {
  const firstLine = input.split("\n")[0].trim();
  const parts = firstLine.split(/\s+/);
  if (parts.length !== 2) {
    return "First line must have two coordinates separated by whitespace.";
  }
  const [x, y] = parts.map(Number);
  if (
    isNaN(x) ||
    isNaN(y) ||
    x <= 0 ||
    x > 50 ||
    y <= 0 ||
    y > 50
  ) {
    return "Coordinates must be numbers between 1 and 50.";
  }
  return null;
}

export function validateRobots(lines: string[]) {
  if ((lines.length - 1) % 2 !== 0) {
    return "Each robot must have two lines: position and instructions.";
  }
  for (let i = 1; i < lines.length; i += 2) {
    const posParts = lines[i].trim().split(/\s+/);
    if (posParts.length !== 3) {
      return `Robot at line ${i + 1}: Position must have two coordinates and an orientation. All separated by whitespace`;
    }
    const [x, y, orientation] = posParts;
    const xNum = Number(x);
    const yNum = Number(y);
    if (
      !/^\d+$/.test(x) ||
      !/^\d+$/.test(y) ||
      isNaN(xNum) ||
      isNaN(yNum) ||
      xNum < 0 ||
      xNum > 50 ||
      yNum < 0 ||
      yNum > 50
    ) {
      return `Robot at line ${i + 1}: Coordinates must be integers between 0 and 50.`;
    }
    if (!["N", "S", "E", "W"].includes(orientation)) {
      return `Robot at line ${i + 1}: Orientation must be N, S, E, or W.`;
    }
    const instructions = lines[i + 1].trim();
    if (instructions.length > 100) {
      return `Robot at line ${i + 2}: Instructions must be less than 100 characters.`;
    }
    if (!/^[LRF]*$/.test(instructions)) {
      return `Robot at line ${i + 2}: Instructions must only contain L, R, and F.`;
    }
  }
  return null;
}

function turn(orientation: Orientation, command: Command): Orientation {
  const idx = orientations.indexOf(orientation);
  if (command === "L") {
    return orientations[(idx + 3) % 4];
  } else if (command === "R") {
    return orientations[(idx + 1) % 4];
  }
  return orientation;
}

export function processRobots(input: string): string[] {
  const lines = input.split("\n").map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length < 3) return [];
  const [maxX, maxY] = lines[0].split(/\s+/).map(Number);
  const results: string[] = [];
  for (let i = 1; i < lines.length; i += 2) {
    let [x, y, orientation] = lines[i].split(/\s+/);
    let posX = Number(x);
    let posY = Number(y);
    let orient = orientation as Orientation;
    const instructions = lines[i + 1].split("") as Command[];
    for (const cmd of instructions) {
      if (cmd === "L" || cmd === "R") {
        orient = turn(orient, cmd);
      } else if (cmd === "F") {
        const [dx, dy] = moveDelta[orient];
        const newX = posX + dx;
        const newY = posY + dy;
        if (newX >= 0 && newX <= maxX && newY >= 0 && newY <= maxY) {
          posX = newX;
          posY = newY;
        }
      }
    }
    results.push(`${posX} ${posY} ${orient}`);
  }
  return results;
}