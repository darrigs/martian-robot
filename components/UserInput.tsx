import React from "react";

interface UserInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export default function UserInput({ value, onChange, error }: UserInputProps) {
  return (
    <div>
      <textarea
        rows={8}
        placeholder={`First line: two coordinates representing the upper-right coordinates of the rectangular world, (1-50)\nThen, for each robot:\n- Position: x y orientation (N/S/E/W)\n- Instructions: L, R, F`}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%" }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}