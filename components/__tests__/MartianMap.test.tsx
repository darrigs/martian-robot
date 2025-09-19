import { render, screen, fireEvent } from "@testing-library/react";
import MartianMap from "../MartianMap";

const validInput = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;

const lostInput = `5 3
3 2 N
FRRFLLFFRRFLL`;

const notLostInput = `5 3
1 1 E
RFRFRFRF`;

const mixedInput = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL`;

describe("MartianMap", () => {
  it("renders UserInput and output section", () => {
    render(<MartianMap />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("shows error for invalid input", () => {
    render(<MartianMap />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "invalid" } });
    expect(screen.getByText(/First line must have two coordinates/)).toBeInTheDocument();
  });

  it("shows results for valid input", () => {
    render(<MartianMap />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: validInput } });
    expect(screen.getByText(/Final Robot Positions:/)).toBeInTheDocument();
    expect(screen.getAllByTestId("robot-result").length).toBe(3);
    expect(screen.getByText("1 1 E")).toBeInTheDocument();
    expect(screen.getByText("3 3 N LOST")).toBeInTheDocument();
    expect(screen.getByText("2 3 S")).toBeInTheDocument();
  });

  it("shows LOST when a robot falls off the grid", () => {
    render(<MartianMap />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: lostInput } });
    expect(screen.getByText(/LOST/)).toBeInTheDocument();
    expect(screen.getByText(/3 3 N LOST/)).toBeInTheDocument();
  });

  it("does not show LOST when robot stays on the grid", () => {
    render(<MartianMap />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: notLostInput } });
    expect(screen.queryByText(/LOST/)).not.toBeInTheDocument();
    expect(screen.getByText(/1 1 E/)).toBeInTheDocument();
  });

  it("handles multiple robots with mixed LOST and not LOST", () => {
    render(<MartianMap />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: mixedInput } });
    expect(screen.getAllByTestId("robot-result").length).toBe(2);
    expect(screen.getByText("1 1 E")).toBeInTheDocument();
    expect(screen.getByText("3 3 N LOST")).toBeInTheDocument();
  });

  it("clears error and results on empty input", () => {
    render(<MartianMap />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "invalid" } });
    expect(screen.getByText(/First line must have two coordinates/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "" } });
    expect(screen.queryByText(/First line must have two coordinates/)).not.toBeInTheDocument();
    expect(screen.queryByTestId("robot-result")).not.toBeInTheDocument();
  });

  it("handles input with extra whitespace and blank lines", () => {
    const inputWithWhitespace = `5 3

1 1 E

RFRFRFRF

0 3 W

LLFFFLFLFL
`;
    render(<MartianMap />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: inputWithWhitespace } });
    expect(screen.getAllByTestId("robot-result").length).toBe(2);
    expect(screen.getByText("1 1 E")).toBeInTheDocument();
    expect(screen.getByText("2 3 S")).toBeInTheDocument();
  });
});