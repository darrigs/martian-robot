import { useState } from "react";
import UserInput from "./UserInput";
import {
  validateFirstLine,
  validateRobots,
  processRobots,
} from "../lib/robot";

export default function MartianMap() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);

  const handleInputChange = (value: string) => {
    setInput(value);

    const lines = value
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      setError(null);
      setResults([]);
      return;
    }

    let err = validateFirstLine(value);
    if (!err && lines.length > 1) {
      err = validateRobots(lines);
    }
    setError(err);

    if (!err) {
      setResults(processRobots(value));
    } else {
      setResults([]);
    }
  };

  return (
    <div>
      <UserInput value={input} onChange={handleInputChange} error={error} />
      {results.length > 0 && !error && (
        <div>
          <h3>Final Robot Positions:</h3>
          <ul>
            {results.map((res, idx) => (
              <li key={idx} data-testid="robot-result">{res}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}