import { useState, useEffect } from "react";
import Wheel from "./components/Wheel";
import "./App.css";

export default function App() {
  const [options, setOptions] = useState(() =>
    JSON.parse(localStorage.getItem("options")) || []
  );
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options]);

  const addOption = () => {
    if (input.trim()) {
      setOptions([...options, input]);
      setInput("");
    }
  };

  const removeOption = (i) => {
    setOptions(options.filter((_, idx) => idx !== i));
  };

  return (
    <div className="app">
      <h1 className="title">🎡 Decision Wheel</h1>

      <div className="input-section">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add your choices..."
          onKeyDown={(e) => e.key === "Enter" && addOption()}
        />
        <button onClick={addOption}>＋</button>
      </div>

      <div className="chips">
        {options.map((opt, i) => (
          <div key={i} className="chip">
            {opt}
            <span onClick={() => removeOption(i)}>✕</span>
          </div>
        ))}
      </div>

      <Wheel options={options} setResult={setResult} />

      {result && (
        <div className="result-box">
          🎉🎊🥳 {result} 🥳🎊🎉
        </div>
      )}
    </div>
  );
}