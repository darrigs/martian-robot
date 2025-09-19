import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import UserInput from "../UserInput";

describe("UserInput", () => {
  it("renders label, textarea, and error", () => {
    render(<UserInput value="" onChange={() => {}} error="Test error" />);
    expect(screen.getByLabelText(/Enter Martian Robot Instructions/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const handleChange = jest.fn();
    render(<UserInput value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "test" } });
    expect(handleChange).toHaveBeenCalledWith("test");
  });

  it("shows placeholder text", () => {
    render(<UserInput value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText(/First line: two coordinates/i)).toBeInTheDocument();
  });

  it("sets aria-invalid and aria-describedby when error is present", () => {
    render(<UserInput value="" onChange={() => {}} error="Error!" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby", "martian-input-error");
  });

  it("does not render error paragraph or aria attributes when error is not present", () => {
    render(<UserInput value="" onChange={() => {}} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).not.toHaveAttribute("aria-describedby");
    expect(textarea).toHaveAttribute("aria-invalid", "false");
    expect(screen.queryByTestId("martian-input-error")).not.toBeInTheDocument();
  });
});