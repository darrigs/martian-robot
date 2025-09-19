export type Orientation = "N" | "E" | "S" | "W";
export type Command = "L" | "R" | "F";

const orientations: Orientation[] = ["N", "E", "S", "W"];

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
  }
  return orientations[(idx + 1) % 4];
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

const commandHandlers: { [key in Command]: CommandHandler } = {
  L: (state) => {
    state.orientation = turn(state.orientation, "L");
  },
  R: (state) => {
    state.orientation = turn(state.orientation, "R");
  },
  F: (state, maxX, maxY, scented) => {
    let positionKey = `${state.x} ${state.y} ${state.orientation}`;
    let newX = state.x;
    let newY = state.y;

    // Move based on orientation
    switch (state.orientation) {
      case 'N':
        newY += 1;
        break;
      case 'E':
        newX += 1;
        break;
      case 'S':
        newY -= 1;
        break;
      case 'W':
        newX -= 1;
        break;
    }

    // Check if the robot goes out of bounds
    if (newX < 0 || newX > maxX || newY < 0 || newY > maxY) {
      if (!scented.has(positionKey)) {
        state.lost = true; // Mark as lost
        scented.add(positionKey); // Add to scented positions
      }
    } else if (!scented.has(positionKey)) {
      // Move only if the current position is not scented
      state.x = newX;
      state.y = newY;
    }
  }
};

export function processRobots(input: string): string[] {
  // Split the input into lines, trim whitespace, and filter out any empty lines
  const lines = input.split("\n").map(line => line.trim()).filter(Boolean);

  // Check if there are enough lines for processing
  if (lines.length < 3) return [];

  // Parse the maximum coordinates from the first line
  const [maxX, maxY] = lines[0].split(/\s+/).map(Number);
  const results: string[] = [];

  // Initialize the scented set to track positions where robots have been lost
  const scented = new Set<string>();

  // Iterate through the robot position and instruction lines
  for (let i = 1; i < lines.length; i += 2) {
    const [x, y, orientation] = lines[i].split(/\s+/);

    // Create a new state for each robot
    const state: RobotState = {
      x: Number(x),
      y: Number(y),
      orientation: orientation as Orientation,
      lost: false,
    };

    // Split the instructions into an array of commands
    const instructions = lines[i + 1].split("") as Command[];

    // Process each command for the robot
    for (const cmd of instructions) {
      if (state.lost) break; // Stop processing if the robot is already lost
      const handler = commandHandlers[cmd]; // Get the command handler
      if (handler) handler(state, maxX, maxY, scented); // Execute the command if valid
      // Unknown commands are ignored
    }

    // Store the final position and status of the robot
    results.push(
      `${state.x} ${state.y} ${state.orientation}${state.lost ? " LOST" : ""}`
    );
  }

  return results; // Return the results array containing the final states of all robots
}