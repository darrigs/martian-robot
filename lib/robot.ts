export type Orientation = "N" | "E" | "S" | "W";
export type Command = "L" | "R" | "F";

const orientations: Orientation[] = ["N", "E", "S", "W"];
const moveDelta: Record<Orientation, [number, number]> = {
  N: [0, 1],
  E: [1, 0],
  S: [0, -1],
  W: [-1, 0],
};

function isIntegerInRange(val: string, min: number, max: number): boolean {
  const num = Number(val);
  return /^\d+$/.test(val) && !isNaN(num) && num >= min && num <= max;
}

export function validateFirstLine(input: string) {
  const firstLine = input.split("\n")[0].trim();
  const parts = firstLine.split(/\s+/);
  if (parts.length !== 2) {
    return "First line must have two coordinates separated by whitespace.";
  }
  const [x, y] = parts;
  if (!isIntegerInRange(x, 1, 50) || !isIntegerInRange(y, 1, 50)) {
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
      return `Robot at line ${i + 1}: Position must have two coordinates and an orientation. All separated by whitespace.`;
    }
    const [x, y, orientation] = posParts;
    if (!isIntegerInRange(x, 0, 50) || !isIntegerInRange(y, 0, 50)) {
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

type RobotState = {
  x: number;
  y: number;
  orientation: Orientation;
  lost: boolean;
};

type CommandHandler = (
  state: RobotState,
  maxX: number,
  maxY: number,
  scented: Set<string>
) => void;

const commandHandlers: Record<Command, CommandHandler> = {
  L: (state) => {
    state.orientation = turn(state.orientation, "L");
  },
  R: (state) => {
    state.orientation = turn(state.orientation, "R");
  },
  F: (state, maxX, maxY, scented) => {
    const [dx, dy] = moveDelta[state.orientation];
    const newX = state.x + dx;
    const newY = state.y + dy;
    if (newX < 0 || newX > maxX || newY < 0 || newY > maxY) {
      const scentKey = `${state.x},${state.y},${state.orientation}`;
      if (!scented.has(scentKey)) {
        state.lost = true;
        scented.add(scentKey);
      }
      // If scented, ignore this instruction
    } else {
      state.x = newX;
      state.y = newY;
    }
  },
  // Add new commands here as needed
};

export function processRobots(input: string): string[] {
  const lines = input.split("\n").map(line => line.trim()).filter(Boolean);
  if (lines.length < 3) return [];
  const [maxX, maxY] = lines[0].split(/\s+/).map(Number);
  const results: string[] = [];
  const scented = new Set<string>();

  for (let i = 1; i < lines.length; i += 2) {
    const [x, y, orientation] = lines[i].split(/\s+/);
    const state: RobotState = {
      x: Number(x),
      y: Number(y),
      orientation: orientation as Orientation,
      lost: false,
    };
    const instructions = lines[i + 1].split("") as Command[];

    for (const cmd of instructions) {
      if (state.lost) break;
      const handler = commandHandlers[cmd];
      if (handler) handler(state, maxX, maxY, scented);
      // Unknown commands are ignored
    }
    results.push(
      `${state.x} ${state.y} ${state.orientation}${state.lost ? " LOST" : ""}`
    );
  }
  return results;
}