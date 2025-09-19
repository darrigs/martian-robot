import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import UserInput from "../UserInput";

describe("UserInput", () => {
  it("renders textarea and error", () => {
    render(<UserInput value="" onChange={() => {}} error="Test error" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const handleChange = jest.fn();
    render(<UserInput value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "test" } });
    expect(handleChange).toHaveBeenCalledWith("test");
  });
});