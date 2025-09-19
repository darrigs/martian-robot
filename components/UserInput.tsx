import React from "react";

interface UserInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export default function UserInput({ value, onChange, error }: UserInputProps) {
  return (
    <div>
      <label htmlFor="martian-input" style={{ fontWeight: "bold" }}>
        Enter Martian Robot Instructions:
      </label>
      <textarea
        id="martian-input"
        rows={8}
        placeholder={`First line: two coordinates representing the upper-right coordinates of the rectangular world, (1-50)
Then, for each robot:
- Position: x y orientation (N/S/E/W)
- Instructions: L, R, F`}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", marginTop: "0.5em" }}
        aria-invalid={!!error}
        aria-describedby={error ? "martian-input-error" : undefined}
      />
      {error && (
        <p id="martian-input-error" style={{ color: "red", marginTop: "0.5em" }}>
          {error}
        </p>
      )}
    </div>
  );
}