import { useState } from "react";

export default function InputBox({ addOption }) {
  const [input, setInput] = useState("");

  const submit = (e) => {
    e.preventDefault();
    addOption(input);
    setInput("");
  };

  return (
    <form className="input-box" onSubmit={submit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add option..."
      />
      <button>Add</button>
    </form>
  );
}