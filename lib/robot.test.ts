import {
  validateFirstLine,
  validateRobots,
  processRobots,
} from "./robot";

describe("validateFirstLine", () => {
  it("accepts valid coordinates in range", () => {
    expect(validateFirstLine("5 3")).toBeNull();
    expect(validateFirstLine("1 1")).toBeNull();
    expect(validateFirstLine("50 50")).toBeNull();
  });

  it("rejects coordinates out of range or invalid", () => {
    expect(validateFirstLine("0 0")).toMatch(/between 1 and 50/);
    expect(validateFirstLine("51 1")).toMatch(/between 1 and 50/);
    expect(validateFirstLine("1 51")).toMatch(/between 1 and 50/);
    expect(validateFirstLine("a b")).toMatch(/numbers between 1 and 50/);
    expect(validateFirstLine("")).toMatch(/two coordinates/);
    expect(validateFirstLine("5")).toMatch(/two coordinates/);
    expect(validateFirstLine("5 3 2")).toMatch(/two coordinates/);
    expect(validateFirstLine("   ")).toMatch(/two coordinates/);
  });
});

describe("validateRobots", () => {
  it("accepts valid robot lines", () => {
    const lines = [
      "5 3",
      "1 1 E",
      "RFRFRFRF",
      "3 2 N",
      "FRRFLLFFRRFLL",
    ];
    expect(validateRobots(lines)).toBeNull();
  });

  it("rejects missing or extra robot position fields", () => {
    const linesMissing = [
      "5 3",
      "1 E",
      "RFRFRFRF",
    ];
    expect(validateRobots(linesMissing)).toMatch(/Position must have two coordinates/);

    const linesExtra = [
      "5 3",
      "1 1 E N",
      "RFRFRFRF",
    ];
    expect(validateRobots(linesExtra)).toMatch(/Position must have two coordinates/);
  });

  it("rejects robot coordinates out of range or invalid", () => {
    const lines = [
      "5 3",
      "51 1 E",
      "RFRFRFRF",
    ];
    expect(validateRobots(lines)).toMatch(/integers between 0 and 50/);

    const lines2 = [
      "5 3",
      "1 -1 E",
      "RFRFRFRF",
    ];
    expect(validateRobots(lines2)).toMatch(/integers between 0 and 50/);

    const lines3 = [
      "5 3",
      "a 1 E",
      "RFRFRFRF",
    ];
    expect(validateRobots(lines3)).toMatch(/integers between 0 and 50/);
  });

  it("rejects invalid orientation", () => {
    const lines = [
      "5 3",
      "1 1 X",
      "RFRFRFRF",
    ];
    expect(validateRobots(lines)).toMatch(/Orientation must be N, S, E, or W/);
  });

  it("rejects instructions with invalid characters", () => {
    const lines = [
      "5 3",
      "1 1 E",
      "RFRX",
    ];
    expect(validateRobots(lines)).toMatch(/only contain L, R, and F/);
  });

  it("rejects instructions longer than 100 characters", () => {
    const longInstructions = "F".repeat(101);
    const lines = [
      "5 3",
      "1 1 E",
      longInstructions,
    ];
    expect(validateRobots(lines)).toMatch(/less than 100 characters/);
  });

  it("rejects odd number of robot lines", () => {
    const lines = [
      "5 3",
      "1 1 E",
      "RFRFRFRF",
      "3 2 N",
    ];
    expect(validateRobots(lines)).toMatch(/Each robot must have two lines/);
  });
});

describe("processRobots", () => {
  it("returns correct final positions (no LOST)", () => {
    const input = `5 3
1 1 E
RFRFRFRF
0 3 W
LLFFFRFRFR`;
    expect(processRobots(input)).toEqual([
      "1 1 E",
      "2 2 N",
    ]);
  });

  it("returns LOST when robot falls off grid", () => {
    const input = `5 3
3 2 N
FRRFLLFFRRFLL`;
    expect(processRobots(input)).toEqual([
      "3 3 N LOST",
    ]);
  });

  it("prevents second robot from getting LOST at scented position", () => {
    const input = `5 3
3 2 N
FRRFLLFFRRFLL
3 2 N
FRRFLLFFRRFLL`;
    expect(processRobots(input)).toEqual([
      "3 3 N LOST",
      "3 2 N",
    ]);
  });

  it("handles multiple robots with mixed LOST and not LOST", () => {
    const input = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;
    expect(processRobots(input)).toEqual([
      "1 1 E",
      "3 3 N LOST",
      "2 3 S",
    ]);
  });

  it("returns empty array for empty or incomplete input", () => {
    expect(processRobots("")).toEqual([]);
    expect(processRobots("5 3")).toEqual([]);
    expect(processRobots("5 3\n1 1 E")).toEqual([]);
  });

  it("ignores unknown commands", () => {
    const input = `5 3
1 1 E
RFRFRFRFXYZ`;
    expect(processRobots(input)).toEqual([
      "1 1 E",
    ]);
  });

  it("handles whitespace and blank lines gracefully", () => {
    const input = `5 3

1 1 N

RFRF

0 3 W

RRFFFRF
`;
    expect(processRobots(input)).toEqual([
      "2 0 S",
      "3 2 S",
    ]);
  });

  it("handles robots at grid edges", () => {
    const input = `5 3
0 0 S
FFFF
5 3 N
F
`;
    expect(processRobots(input)).toEqual([
      "0 0 S LOST",
      "5 3 N LOST",
    ]);
  });
});

describe("processRobots - full sample input/output", () => {
  it("matches the sample output for the sample input", () => {
    const input = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;
    const expected = [
      "1 1 E",
      "3 3 N LOST",
      "2 3 S",
    ];
    expect(processRobots(input)).toEqual(expected);
  });
});