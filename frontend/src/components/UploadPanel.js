import React, { useState } from "react";

export default function UploadPanel({ onSubmit }) {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState(8);

  const handleSend = () => {
    if (!file) return alert("Select image");
    onSubmit(file, level);
  };

  return (
    <div>
      <h3>Rover Transmission</h3>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <div style={{ marginTop: 15 }}>
        <label>Transmission Mode:</label>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value={2}>Emergency Preview</option>
          <option value={4}>Low Bandwidth</option>
          <option value={8}>Standard</option>
          <option value={16}>Scientific</option>
          <option value={32}>Archive</option>
        </select>
      </div>

      <button onClick={handleSend} style={{ marginTop: 15 }}>
        Send To Earth
      </button>
    </div>
  );
}
