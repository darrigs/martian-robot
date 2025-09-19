import { render, screen, fireEvent } from "@testing-library/react";
import MartianMap from "../MartianMap";

const validInput = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;

describe("MartianMap", () => {
  it("renders UserInput and output", () => {
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
    expect(screen.getAllByRole("listitem").length).toBe(3);
  });
});